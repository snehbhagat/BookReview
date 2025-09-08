const express = require('express');
const router = express.Router();
const { redis } = require('../lib/redis');

const DEFAULT_FIELDS = 'key,title,author_name,isbn,cover_edition_key,first_publish_year';

// Helper: pick first valid 13-digit ISBN
function pickIsbn13(list = []) {
  return list.find(i => i && i.length === 13 && /^[0-9Xx]+$/.test(i));
}

// Normalize one search doc
function normalizeDoc(doc) {
  const workKey = doc.key; // e.g. /works/OL12345W
  const id = workKey?.replace(/^\/works\//, '') || workKey || '';
  const authors = doc.author_name || [];
  const isbn13 = pickIsbn13(doc.isbn);
  const olid = doc.cover_edition_key || null;
  let coverUrl = null;
  if (isbn13) {
    coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn13}-L.jpg`;
  } else if (olid) {
    coverUrl = `https://covers.openlibrary.org/b/olid/${olid}-L.jpg`;
  }
  return {
    id,
    title: doc.title || 'Untitled',
    authors,
    isbn13: isbn13 || null,
    olid,
    year: doc.first_publish_year || null,
    coverUrl
  };
}

// GET /api/open/search?q=harry+potter&page=1&limit=20
router.get('/search', async (req, res, next) => {
  try {
    const {
      q = '',
      page = 1,
      limit = 20,
      fields // optional override
    } = req.query;

    const query = String(q || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Missing q parameter' });
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);

    const cacheTtl = parseInt(process.env.OPEN_LIBRARY_CACHE_TTL || '600', 10);
    const cacheKey = `ol:search:${query}:${pageNum}:${limitNum}:${fields || 'default'}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const params = new URLSearchParams();
    params.set('q', query);
    params.set('page', pageNum);
    params.set('limit', limitNum);
    params.set('fields', fields || DEFAULT_FIELDS);

    const url = `https://openlibrary.org/search.json?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BookReviewApp/1.0 (OpenLibrary Proxy)'
      }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Open Library upstream error' });
    }
    const data = await response.json();

    const docs = Array.isArray(data.docs) ? data.docs : [];
    const items = docs.map(normalizeDoc);

    const result = {
      query,
      page: pageNum,
      limit: limitNum,
      total: data.numFound || items.length,
      totalPages: Math.ceil((data.numFound || items.length) / limitNum),
      items
    };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', cacheTtl);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// GET /api/open/book?isbn=0451526538 OR /api/open/book?olid=OL12345M
router.get('/book', async (req, res, next) => {
  try {
    const { isbn, olid } = req.query;
    if (!isbn && !olid) {
      return res.status(400).json({ error: 'Provide isbn or olid' });
    }

    const cacheTtl = parseInt(process.env.OPEN_LIBRARY_BOOK_CACHE_TTL || '3600', 10);
    const cacheKey = `ol:book:${isbn || ''}:${olid || ''}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    let bibKey;
    if (isbn) {
      bibKey = `ISBN:${isbn}`;
    } else {
      // For edition OLIDs, the Books API supports OLID: prefix
      bibKey = `OLID:${olid}`;
    }

    const params = new URLSearchParams();
    params.set('bibkeys', bibKey);
    params.set('format', 'json');
    params.set('jscmd', 'data');

    const url = `https://openlibrary.org/api/books?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Open Library upstream error' });
    }
    const data = await response.json();
    const raw = data[bibKey];
    if (!raw) {
      return res.status(404).json({ error: 'Not found' });
    }

    const details = {
      id: raw.key?.replace(/^\/books\//, '') || raw.key || bibKey,
      title: raw.title,
      authors: (raw.authors || []).map(a => a.name),
      pages: raw.number_of_pages || null,
      subjects: (raw.subjects || []).map(s => s.name).slice(0, 25),
      publishDate: raw.publish_date || null,
      publishers: (raw.publishers || []).map(p => p.name),
      cover: raw.cover || null,
      identifiers: raw.identifiers || {},
      url: raw.url || null,
      preview: raw.preview || null
    };

    await redis.set(cacheKey, JSON.stringify(details), 'EX', cacheTtl);
    res.json(details);
  } catch (e) {
    next(e);
  }
});

module.exports = router;