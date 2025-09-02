const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis error', err));

module.exports = { redis };