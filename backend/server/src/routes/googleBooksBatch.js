const express = require('express');
const router = express.Router();
const { redis } = require('../lib/redis');
const fetch = global.fetch;

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE = 'https://www.googleapis.com/books/v1';
const TTL_BATCH = 600;

function bestImage(imageLinks = {}) {
  return imageLinks.large || imageLinks.medium || imageLinks.small || imageLinks.thumbnail || imageLinks.smallThumbnail || null;
}

router.get('/enrich', async (req, res) => {
  if (!API_KEY) return res.status(501).json({ error: 'Google Books API not configured' });
  const isbns = String(req.query.isbns || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 50); // cap

  if (!isbns.length) return res.status(400).json({ error: 'Provide isbns=comma,separated,isbn13' });

  // Try cache aggregate
  const results = {};
  const toFetch = [];

  for (const isbn of isbns) {
    const cacheKey = `gbooks:isbn:${isbn}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      results[isbn] = JSON.parse(cached);
    } else {
      toFetch.push(isbn);
    }
  }

  // Fetch missing sequentially (Google volumes doesn't have multi-isbn batch; we use q=isbn:)
  for (const isbn of toFetch) {
    try {
      const params = new URLSearchParams({ q: `isbn:${isbn}`, maxResults: 1, key: API_KEY });
      const r = await fetch(`${BASE}/volumes?${params.toString()}`);
      if (!r.ok) {
        results[isbn] = null;
        continue;
      }
      const json = await r.json();
      const item = json.items?.[0];
      if (!item) {
        results[isbn] = null;
        continue;
      }
      const v = item.volumeInfo || {};
      results[isbn] = {
        previewLink: v.previewLink || null,
        thumbnail: bestImage(v.imageLinks || {}) || null,
        categories: v.categories || [],
        pageCount: v.pageCount || null
      };
      await redis.set(`gbooks:isbn:${isbn}`, JSON.stringify(results[isbn]), 'EX', TTL_BATCH);
    } catch {
      results[isbn] = null;
    }
  }

  res.json({ count: isbns.length, results });
});

module.exports = router;