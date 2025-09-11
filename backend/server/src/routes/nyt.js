const express = require('express');
const router = express.Router();
const { redis } = require('../lib/redis');
const fetch = global.fetch;

const BASE = 'https://api.nytimes.com/svc/books/v3';
const API_KEY = process.env.NYT_API_KEY;

if (!API_KEY) {
  console.warn('[NYT] NYT_API_KEY not set. /api/nyt endpoints will return 501.');
}

// Configurable TTLs
const TTL_NAMES = parseInt(process.env.NYT_CACHE_TTL_NAMES || '7200', 10);   // 2h
const TTL_OVERVIEW = parseInt(process.env.NYT_CACHE_TTL_OVERVIEW || '900', 10);
const TTL_LIST = parseInt(process.env.NYT_CACHE_TTL_LIST || '900', 10);
const TTL_STALE = 24 * 3600;

// Simple single-flight locks (key -> promise)
const inflight = new Map();

class UpstreamHttpError extends Error {
  constructor(status, message, bodySnippet) {
    super(message);
    this.name = 'UpstreamHttpError';
    this.status = status;
    this.bodySnippet = bodySnippet;
  }
}

async function fetchNYT(url, { retries = 3, baseDelay = 400 } = {}) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'BookReviewApp/1.0 (NYT Proxy)' } });
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        attempt++;
        if (attempt >= retries) {
          const txt = await res.text().catch(() => '');
            throw new UpstreamHttpError(res.status, `NYT upstream error ${res.status}`, txt.slice(0, 500));
        }
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 150;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new UpstreamHttpError(res.status, `NYT upstream error ${res.status}`, txt.slice(0, 500));
      }
      return res.json();
    } catch (e) {
      if (e instanceof UpstreamHttpError) throw e;
      attempt++;
      if (attempt >= retries) throw e;
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 150;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

function error501(res) {
  return res.status(501).json({ error: 'NYT API not configured (missing NYT_API_KEY)' });
}

function normalizeListName(entry) {
  return {
    list_name: entry.list_name,
    display_name: entry.display_name,
    updated: entry.updated,
    oldest_published_date: entry.oldest_published_date,
    newest_published_date: entry.newest_published_date
  };
}

function normalizeBook(listName, book) {
  return {
    rank: book.rank,
    title: book.title,
    author: book.author,
    description: book.description,
    primary_isbn13: book.primary_isbn13 || null,
    publisher: book.publisher,
    book_image: book.book_image || null,
    list_name: listName,
    weeks_on_list: book.weeks_on_list,
    amazon_url: book.amazon_product_url || null
  };
}

function slugifyDisplayName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const LIST_SLUG_ALIASES = new Map([
  ['children-s-middle-grade-hardcover', 'childrens-middle-grade-hardcover'],
  ['childrens-middle-grade-hardcover', 'childrens-middle-grade-hardcover'],
  ['young-adult-hardcover', 'young-adult-hardcover']
]);

async function setCacheWithStale(key, payload, ttlFresh, ttlStale = TTL_STALE) {
  await redis.set(key, JSON.stringify(payload), 'EX', ttlFresh);
  await redis.set(`${key}:stale`, JSON.stringify(payload), 'EX', ttlStale);
}

async function getCacheOrStale(key) {
  const fresh = await redis.get(key);
  if (fresh) return { json: JSON.parse(fresh), stale: false, source: 'fresh' };
  const stale = await redis.get(`${key}:stale`);
  if (stale) return { json: JSON.parse(stale), stale: true, source: 'stale' };
  return { json: null, stale: false, source: 'miss' };
}

// Single-flight wrapper
async function singleFlight(key, fn) {
  if (inflight.has(key)) return inflight.get(key);
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

async function getListNamesCached() {
  const cacheKey = 'nyt:list-names';
  const cached = await getCacheOrStale(cacheKey);
  if (cached.json) {
    if (cached.stale) {
      console.log('[NYT] list-names cache STALE hit');
    } else {
      // Only log the first time after start to avoid clutter
      // console.log('[NYT] list-names cache FRESH hit');
    }
    return { ...cached, listNames: cached.json.listNames };
  }
  console.log('[NYT] list-names cache MISS -> fetching upstream');
  return singleFlight(cacheKey + ':sf', async () => {
    const url = `${BASE}/lists/names.json?api-key=${API_KEY}`;
    const json = await fetchNYT(url);
    if (json.status !== 'OK') throw new Error('Unexpected NYT response for list-names');
    const listNames = (json.results || []).map(normalizeListName);
    const payload = { listNames, count: listNames.length, fetched_at: new Date().toISOString() };
    await setCacheWithStale(cacheKey, payload, TTL_NAMES);
    return { listNames, json: payload, stale: false };
  });
}

async function coerceListSlug(input) {
  if (!input) return null;
  const raw = decodeURIComponent(String(input)).trim();
  if (/^[a-z0-9-]+$/.test(raw)) {
    const normalized = raw.toLowerCase();
    if (LIST_SLUG_ALIASES.has(normalized)) {
      const alias = LIST_SLUG_ALIASES.get(normalized);
      console.log(`[NYT] slug alias applied: ${normalized} -> ${alias}`);
      return alias;
    }
    return normalized;
  }
  const spaced = raw.replace(/\+/g, ' ').trim();
  const approxSlug = slugifyDisplayName(spaced);
  if (LIST_SLUG_ALIASES.has(approxSlug)) {
    const alias = LIST_SLUG_ALIASES.get(approxSlug);
    console.log(`[NYT] slug alias applied: ${approxSlug} -> ${alias}`);
    return alias;
  }
  try {
    const { listNames } = await getListNamesCached();
    const byDisplay = listNames.find(l => l.display_name.toLowerCase() === spaced.toLowerCase());
    if (byDisplay) return byDisplay.list_name.toLowerCase();
    const bySlugify = listNames.find(l => slugifyDisplayName(l.display_name) === approxSlug);
    if (bySlugify) return bySlugify.list_name.toLowerCase();
  } catch {
    // ignore
  }
  return approxSlug || null;
}

// --------------- Routes -------------------

router.get('/list-names', async (req, res) => {
  try {
    if (!API_KEY) return error501(res);
    const cacheKey = 'nyt:list-names';
    const cached = await getCacheOrStale(cacheKey);
    if (cached.json && !cached.stale) {
      return res.json(cached.json);
    }
    // Attempt refresh
    try {
      const url = `${BASE}/lists/names.json?api-key=${API_KEY}`;
      const json = await fetchNYT(url);
      if (json.status !== 'OK') return res.status(502).json({ error: 'Unexpected NYT response' });
      const listNames = (json.results || []).map(normalizeListName);
      const payload = { listNames, count: listNames.length, fetched_at: new Date().toISOString() };
      await setCacheWithStale(cacheKey, payload, TTL_NAMES);
      return res.json(payload);
    } catch (e) {
      if (cached.json) {
        // Serve stale on ANY upstream failure
        res.set('X-Cache', 'STALE');
        return res.status(200).json(cached.json);
      }
      const status = e.status || 500;
      return res.status(status).json({ error: e.message, upstream: e.bodySnippet });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get('/overview', async (req, res) => {
  try {
    if (!API_KEY) return error501(res);
    const date = (req.query.date || 'current').trim().toLowerCase();
    const safeDate = date === '' ? 'current' : date;
    if (!(safeDate === 'current' || /^\d{4}-\d{2}-\d{2}$/.test(safeDate))) {
      return res.status(400).json({ error: 'Invalid date format. Use current or YYYY-MM-DD.' });
    }
    const cacheKey = `nyt:overview:${safeDate}`;
    const cached = await getCacheOrStale(cacheKey);
    if (cached.json && !cached.stale) return res.json(cached.json);

    try {
      const qs = new URLSearchParams();
      if (safeDate !== 'current') qs.set('published_date', safeDate);
      qs.set('api-key', API_KEY);
      const url = `${BASE}/lists/overview.json?${qs.toString()}`;
      const json = await fetchNYT(url);
      if (json.status !== 'OK') return res.status(502).json({ error: 'Unexpected NYT response' });

      const lists = (json.results?.lists || []).map(list => ({
        list_name: list.list_name,
        display_name: list.display_name,
        updated: list.updated,
        entries: (list.books || []).map(b => normalizeBook(list.list_name, b))
      }));
      const payload = {
        date: json.results?.published_date || safeDate,
        lists,
        fetched_at: new Date().toISOString()
      };
      await setCacheWithStale(cacheKey, payload, TTL_OVERVIEW);
      return res.json(payload);
    } catch (e) {
      if (cached.json) {
        res.set('X-Cache', 'STALE');
        return res.status(200).json(cached.json);
      }
      return res.status(e.status || 500).json({ error: e.message, upstream: e.bodySnippet });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    if (!API_KEY) return error501(res);
    const nameParam = req.query.name || req.query.list;
    if (!nameParam) return res.status(400).json({ error: 'Missing name parameter.' });

    const slug = await coerceListSlug(nameParam);
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ error: 'Invalid list name.' });
    }

    const date = (req.query.date || 'current').trim().toLowerCase();
    const safeDate = date === '' ? 'current' : date;
    if (!(safeDate === 'current' || /^\d{4}-\d{2}-\d{2}$/.test(safeDate))) {
      return res.status(400).json({ error: 'Invalid date format. Use current or YYYY-MM-DD.' });
    }

    const offset = parseInt(req.query.offset || '0', 10);
    if (isNaN(offset) || offset < 0 || offset > 2000) {
      return res.status(400).json({ error: 'Invalid offset.' });
    }

    const cacheKey = `nyt:list:${safeDate}:${slug}:${offset}`;
    const cached = await getCacheOrStale(cacheKey);
    if (cached.json && !cached.stale) return res.json(cached.json);

    try {
      const qs = new URLSearchParams();
      if (offset) qs.set('offset', offset);
      qs.set('api-key', API_KEY);
      const url = `${BASE}/lists/${safeDate}/${slug}.json?${qs.toString()}`;
      const json = await fetchNYT(url);
      if (json.status !== 'OK') return res.status(502).json({ error: 'Unexpected NYT response' });

      const listName = json.results?.list_name || slug;
      const entries = (json.results?.books || []).map(b => normalizeBook(listName, b));
      const payload = {
        list_name: listName,
        display_name: json.results?.display_name || listName,
        date: json.results?.published_date || safeDate,
        next_published_date: json.results?.next_published_date || null,
        previous_published_date: json.results?.previous_published_date || null,
        updated: json.results?.updated || null,
        offset,
        entries,
        fetched_at: new Date().toISOString()
      };
      await setCacheWithStale(cacheKey, payload, TTL_LIST);
      return res.json(payload);
    } catch (e) {
      if (cached.json) {
        res.set('X-Cache', 'STALE');
        return res.status(200).json(cached.json);
      }
      return res.status(e.status || 500).json({ error: e.message, upstream: e.bodySnippet });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;