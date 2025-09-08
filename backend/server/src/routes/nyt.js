const express = require('express');
const router = express.Router();
const { redis } = require('../lib/redis');
const fetch = global.fetch; // Node 18+

// --- Constants / Helpers ---
const BASE = 'https://api.nytimes.com/svc/books/v3';
const API_KEY = process.env.NYT_API_KEY;

if (!API_KEY) {
  console.warn('[NYT] NYT_API_KEY not set. /api/nyt endpoints will return 501.');
}

// Backoff helper with jitter
async function fetchNYT(url, { retries = 3, baseDelay = 400 } = {}) {
  let attempt = 0;
  let lastErr;
  while (attempt < retries) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'BookReviewApp/1.0 (NYT Proxy)'
        }
      });
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        attempt++;
        if (attempt >= retries) {
            const txt = await res.text().catch(() => '');
            throw new Error(`NYT upstream error ${res.status}: ${txt.slice(0,200)}`);
        }
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 150;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`NYT upstream error ${res.status}: ${txt.slice(0,200)}`);
      }
      return res.json();
    } catch (e) {
      lastErr = e;
      attempt++;
      if (attempt >= retries) throw lastErr;
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 150;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

function error501(res) {
  return res.status(501).json({ error: 'NYT API not configured (missing NYT_API_KEY)' });
}

// Normalizers
function normalizeListName(entry) {
  return {
    list_name: entry.list_name,              // machine
    display_name: entry.display_name,
    updated: entry.updated,                  // 'WEEKLY', 'MONTHLY'
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

// TTL helpers
const TTL_NAMES = parseInt(process.env.NYT_CACHE_TTL_NAMES || '3600', 10);
const TTL_OVERVIEW = parseInt(process.env.NYT_CACHE_TTL_OVERVIEW || '900', 10);
const TTL_LIST = parseInt(process.env.NYT_CACHE_TTL_LIST || '600', 10);

// --- Routes ---

// GET /api/nyt/list-names
router.get('/list-names', async (req, res, next) => {
  try {
    if (!API_KEY) return error501(res);

    const cacheKey = 'nyt:list-names';
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const url = `${BASE}/lists/names.json?api-key=${API_KEY}`;
    const json = await fetchNYT(url);
    if (json.status !== 'OK') {
      return res.status(502).json({ error: 'Unexpected NYT response' });
    }
    const listNames = (json.results || []).map(normalizeListName);

    const payload = { listNames, count: listNames.length, fetched_at: new Date().toISOString() };
    await redis.set(cacheKey, JSON.stringify(payload), 'EX', TTL_NAMES);
    res.json(payload);
  } catch (e) {
    next(e);
  }
});

// GET /api/nyt/overview?date=current
router.get('/overview', async (req, res, next) => {
  try {
    if (!API_KEY) return error501(res);

    const date = (req.query.date || 'current').trim().toLowerCase();
    const safeDate = date === '' ? 'current' : date; // allow 'current' or YYYY-MM-DD
    if (!(safeDate === 'current' || /^\d{4}-\d{2}-\d{2}$/.test(safeDate))) {
      return res.status(400).json({ error: 'Invalid date format. Use current or YYYY-MM-DD.' });
    }

    const cacheKey = `nyt:overview:${safeDate}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const qs = new URLSearchParams();
    if (safeDate !== 'current') {
      qs.set('published_date', safeDate);
    }
    qs.set('api-key', API_KEY);
    const url = `${BASE}/lists/overview.json?${qs.toString()}`;

    const json = await fetchNYT(url);
    if (json.status !== 'OK') {
      return res.status(502).json({ error: 'Unexpected NYT response' });
    }

    const lists = (json.results?.lists || []).map(list => {
      const entries = (list.books || []).map(b => normalizeBook(list.list_name, b));
      return {
        list_name: list.list_name,
        display_name: list.display_name,
        updated: list.updated,
        entries
      };
    });

    const payload = {
      date: json.results?.published_date || safeDate,
      lists,
      fetched_at: new Date().toISOString()
    };

    await redis.set(cacheKey, JSON.stringify(payload), 'EX', TTL_OVERVIEW);
    res.json(payload);
  } catch (e) {
    next(e);
  }
});

// GET /api/nyt/list?name=hardcover-fiction&date=current&offset=0
router.get('/list', async (req, res, next) => {
  try {
    if (!API_KEY) return error501(res);

    const nameRaw = req.query.name;
    if (!nameRaw) return res.status(400).json({ error: 'Missing name parameter (list slug).' });
    // Allow a-z, hyphen, digits
    const name = nameRaw.toLowerCase().trim();
    if (!/^[a-z0-9-]+$/.test(name)) {
      return res.status(400).json({ error: 'Invalid list name format.' });
    }

    const date = (req.query.date || 'current').trim().toLowerCase();
    const safeDate = date === '' ? 'current' : date;
    if (!(safeDate === 'current' || /^\d{4}-\d{2}-\d{2}$/.test(safeDate))) {
      return res.status(400).json({ error: 'Invalid date format. Use current or YYYY-MM-DD.' });
    }

    const offsetRaw = req.query.offset || '0';
    const offset = parseInt(offsetRaw, 10);
    if (isNaN(offset) || offset < 0 || offset > 2000) {
      return res.status(400).json({ error: 'Invalid offset (0 <= offset <= 2000).' });
    }

    const cacheKey = `nyt:list:${safeDate}:${name}:${offset}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // NYT list endpoint: /lists/{date}/{list}.json?offset=&api-key=
    const qs = new URLSearchParams();
    if (offset) qs.set('offset', offset);
    qs.set('api-key', API_KEY);
    const url = `${BASE}/lists/${safeDate}/${name}.json?${qs.toString()}`;

    const json = await fetchNYT(url);
    if (json.status !== 'OK') {
      return res.status(502).json({ error: 'Unexpected NYT response' });
    }

    const listName = json.results?.list_name || name;
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

    await redis.set(cacheKey, JSON.stringify(payload), 'EX', TTL_LIST);
    res.json(payload);
  } catch (e) {
    next(e);
  }
});

module.exports = router;