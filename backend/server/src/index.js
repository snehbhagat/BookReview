require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { connectMongo } = require('./lib/mongo');
const { redis } = require('./lib/redis');
const { errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const openLibraryRoutes = require('./routes/openLibrary'); // ADD
const nytRoutes = require('./routes/nyt'); // ADD
const googleBooksRoutes = require('./routes/googleBooks');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120
  })
);

app.get('/health', async (req, res) => {
  try {
    const redisPing = await redis.ping();
    res.json({
      ok: true,
      mongo: 'connected',
      redis: redisPing === 'PONG' ? 'connected' : 'unknown',
      uptime: process.uptime()
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // existing alias
app.use('/api/books', googleBooksRoutes); // ADD
app.use('/api/books', bookRoutes);
app.use('/api/open', openLibraryRoutes); // ADD
app.use('/api/nyt', nytRoutes); // ADD

app.use(errorHandler);

const port = process.env.PORT || 4000;
(async () => {
  await connectMongo();
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
})();