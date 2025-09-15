require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { connectMongo, mongoose } = require('./lib/mongo'); // assume connectMongo initializes mongoose
const { redis } = require('./lib/redis');
const { errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const openLibraryRoutes = require('./routes/openLibrary'); // optional
const nytRoutes = require('./routes/nyt'); // optional
const googleBooksRoutes = require('./routes/googleBooks');
// const { warmNYT } = require('./utils/warmNyt'); // keep if exists

const app = express();

app.use(helmet());

// CORS: allow environment-configured origin in prod; allow everything in dev if not provided
const corsOrigin = process.env.CORS_ORIGIN;
if (process.env.NODE_ENV === 'production' && corsOrigin) {
  app.use(cors({ origin: corsOrigin, credentials: true }));
} else {
  // in dev, reflect incoming origin (safe for development)
  app.use(cors({ origin: true, credentials: true }));
}

app.use(express.json());
app.use(morgan('dev'));
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120
  })
);

// Health endpoint with actual checks
app.get('/health', async (req, res) => {
  try {
    const redisPing = await (redis && redis.ping ? redis.ping() : Promise.resolve('NO_REDIS'));
    const mongoState = (typeof mongoose !== 'undefined' && mongoose.connection)
      ? mongoose.connection.readyState // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
      : null;

    res.json({
      ok: true,
      mongo: mongoState === 1 ? 'connected' : (mongoState === 0 ? 'disconnected' : 'unknown'),
      redis: redisPing === 'PONG' ? 'connected' : 'unknown',
      uptime: process.uptime()
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // alias for compatibility

app.use('/api/books', googleBooksRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/open', openLibraryRoutes);
app.use('/api/nyt', nytRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
(async () => {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
