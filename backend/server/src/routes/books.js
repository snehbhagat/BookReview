const express = require('express');
const Book = require('../models/Book');
const Review = require('../models/Review');
const { authRequired } = require('../middleware/auth');
const { redis } = require('../lib/redis');

const router = express.Router();

// GET /api/books?search=&genre=&author=&sort=rating|newest&page=1&limit=12
router.get('/', async (req, res, next) => {
  try {
    const { search = '', genre, author, sort = 'newest', page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    const cacheKey = `books:${search}:${genre || ''}:${author || ''}:${sort}:${pageNum}:${limitNum}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (genre) filter.genres = genre;
    if (author) filter.authors = author;

    const sortMap = {
      newest: { createdAt: -1 },
      rating: { avgRating: -1, ratingsCount: -1 },
      title: { title: 1 }
    };

    const [items, total] = await Promise.all([
      Book.find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Book.countDocuments(filter)
    ]);

    const result = {
      items,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// POST /api/books (protected)
router.post('/', authRequired, async (req, res, next) => {
  try {
    const { title, description, isbn13, coverUrl, publishedYear, authors = [], genres = [] } = req.body || {};
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const book = await Book.create({
      title,
      description,
      isbn13,
      coverUrl,
      publishedYear,
      authors,
      genres,
      createdBy: req.user.id
    });

    // Invalidate basic caches that could include lists
    await redis.flushdb();

    res.status(201).json(book);
  } catch (e) {
    next(e);
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res, next) => {
  try {
    const key = `book:${req.params.id}`;
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ error: 'Book not found' });

    await redis.set(key, JSON.stringify(book), 'EX', 60);
    res.json(book);
  } catch (e) {
    next(e);
  }
});

// GET /api/books/:id/reviews
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const [items, total] = await Promise.all([
      Review.find({ book: req.params.id })
        .populate('user', 'name avatarUrl')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ book: req.params.id })
    ]);

    res.json({
      items,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/books/:id/reviews (protected)
router.post('/:id/reviews', authRequired, async (req, res, next) => {
  try {
    const { rating, body = '' } = req.body || {};
    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) return res.status(400).json({ error: 'Rating 1-5 required' });

    const existing = await Review.findOne({ user: req.user.id, book: req.params.id });
    if (existing) return res.status(409).json({ error: 'You already reviewed this book' });

    const review = await Review.create({
      user: req.user.id,
      book: req.params.id,
      rating: ratingNum,
      body
    });

    // Update aggregates
    const agg = await Review.aggregate([
      { $match: { book: review.book } },
      { $group: { _id: '$book', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (agg.length) {
      const { avg, count } = agg[0];
      await Book.findByIdAndUpdate(review.book, { avgRating: avg, ratingsCount: count });
    }

    // Invalidate caches related to the book
    await Promise.all([
      redis.del(`book:${req.params.id}`),
      redis.flushdb()
    ]);

    res.status(201).json(review);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: 'You already reviewed this book' });
    }
    next(e);
  }
});

module.exports = router;