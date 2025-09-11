const express = require('express');
const router = express.Router();
const { redis } = require('../lib/redis');

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE = 'https://www.googleapis.com/books/v1';
const fetch = global.fetch;

const TTL_SEARCH = parseInt(process.env.GB_SEARCH_TTL || '600', 10);
const TTL_VOLUME = parseInt(process.env.GB_VOLUME_TTL || '1800', 10);

function normalizeIdentifierPair(ids = []) {
  let isbn10 = null, isbn13 = null;
  for (const id of ids) {
    if (id.type === 'ISBN_10') isbn10 = id.identifier;
    if (id.type === 'ISBN_13') isbn13 = id.identifier;
  }
  return { isbn10, isbn13 };
}

function bestImage(imageLinks = {}) {
  return (
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    null
  );
}

function openLibraryCover(isbn13, size = 'L') {
  if (!isbn13) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn13}-${size}.jpg`;
}

function normalizeItem(item) {
  const v = item.volumeInfo || {};
  const { isbn10, isbn13 } = normalizeIdentifierPair(v.industryIdentifiers || []);
  const thumb = bestImage(v.imageLinks || {}) || openLibraryCover(isbn13, 'L');
  return {
    id: item.id,
    title: v.title || 'Untitled',
    subtitle: v.subtitle || null,
    authors: v.authors || [],
    description: v.description || null,
    categories: v.categories || [],
    thumbnail: thumb,
    previewLink: v.previewLink || null,
    infoLink: v.infoLink || null,
    publisher: v.publisher || null,
    publishedDate: v.publishedDate || null,
    pageCount: v.pageCount || null,
    language: v.language || null,
    industryIdentifiers: { isbn10, isbn13 }
  };
}

function normalizeVolume(json) {
  if (!json || !json.id) return null;
  const base = normalizeItem(json);
  return {
    ...base,
    accessInfo: {
      viewability: json.accessInfo?.viewability || null,
      embeddable: !!json.accessInfo?.embeddable,
      publicDomain: !!json.accessInfo?.publicDomain,
      webReaderLink: json.accessInfo?.webReaderLink || null,
      country: json.accessInfo?.country || null
    }
  };
}

// GET /api/books/search?q=&orderBy=&startIndex=&maxResults=&langRestrict=&printType=
router.get('/search', async (req, res, next) => {
  try {
    if (!API_KEY) {
      return res.status(501).json({ error: 'Google Books API not configured (missing GOOGLE_BOOKS_API_KEY)' });
    }
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Missing q parameter' });

    const orderBy = (req.query.orderBy || 'relevance').toLowerCase();
    if (!['relevance', 'newest'].includes(orderBy)) {
      return res.status(400).json({ error: 'Invalid orderBy (relevance|newest)' });
    }
    const startIndex = Math.max(0, parseInt(req.query.startIndex || '0', 10) || 0);
    const maxResultsRaw = parseInt(req.query.maxResults || '20', 10);
    const maxResults = Math.min(40, Math.max(1, isNaN(maxResultsRaw) ? 20 : maxResultsRaw));
    const langRestrict = String(req.query.langRestrict || '').trim();
    const printType = String(req.query.printType || '').trim(); // all|books|magazines (optional)

    const cacheKey = `gbooks:search:${q}:${orderBy}:${startIndex}:${maxResults}:${langRestrict}:${printType}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const params = new URLSearchParams();
    params.set('q', q);
    params.set('orderBy', orderBy);
    params.set('startIndex', startIndex);
    params.set('maxResults', maxResults);
    params.set('projection', 'lite'); // smaller payload for list
    params.set('key', API_KEY);
    if (langRestrict) params.set('langRestrict', langRestrict);
    if (printType) params.set('printType', printType);

    const url = `${BASE}/volumes?${params.toString()}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'BookReviewApp/1.0 (Google Books Proxy)' } });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      return res.status(r.status).json({ error: `Google Books upstream error: ${text.slice(0,200)}` });
    }
    const json = await r.json();
    const items = (json.items || []).map(normalizeItem);
    const payload = {
      totalItems: json.totalItems || items.length,
      startIndex,
      maxResults,
      items
    };
    await redis.set(cacheKey, JSON.stringify(payload), 'EX', TTL_SEARCH);
    res.json(payload);
  } catch (e) {
    next(e);
  }
});

// GET /api/books/volume/:id?country=US
router.get('/volume/:id', async (req, res, next) => {
  try {
    if (!API_KEY) {
      return res.status(501).json({ error: 'Google Books API not configured (missing GOOGLE_BOOKS_API_KEY)' });
    }
    const id = String(req.params.id || '').trim();
    if (!id) return res.status(400).json({ error: 'Missing volume id' });

    const country = String(req.query.country || '').trim(); // optional, affects preview availability
    const cacheKey = `gbooks:volume:${id}:${country || 'any'}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const params = new URLSearchParams();
    params.set('projection', 'full');
    params.set('key', API_KEY);
    if (country) params.set('country', country);

    const url = `${BASE}/volumes/${encodeURIComponent(id)}?${params.toString()}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'BookReviewApp/1.0 (Google Books Proxy)' } });
    if (r.status === 404) return res.status(404).json({ error: 'Volume not found' });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      return res.status(r.status).json({ error: `Google Books upstream error: ${text.slice(0,200)}` });
    }
    const json = await r.json();
    const vol = normalizeVolume(json);
    if (!vol) return res.status(502).json({ error: 'Unexpected Google Books response' });

    await redis.set(cacheKey, JSON.stringify(vol), 'EX', TTL_VOLUME);
    res.json(vol);
  } catch (e) {
    next(e);
  }
});

module.exports = router;