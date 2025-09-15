const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { defaultAvatar } = require('../utils/avatar');
const crypto = require('crypto');

const router = express.Router();
const isProd = process.env.NODE_ENV === 'production';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- Signup ---
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!isProd) console.log('[AUTH][SIGNUP] body:', { name, email });

    const exists = await User.findOne({ email });
    if (exists) {
      if (!isProd) console.log('[AUTH][SIGNUP] duplicate email', email);
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      avatarUrl: defaultAvatar(name, email)
    });

    if (!isProd) console.log('[AUTH][SIGNUP] created user', user._id.toString());

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token
    });
  } catch (e) {
    if (!isProd) console.error('[AUTH][SIGNUP][ERROR]', e);
    next(e);
  }
});

// --- Login ---
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!isProd) console.log('[AUTH][LOGIN] body:', { email });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token
    });
  } catch (e) {
    if (!isProd) console.error('[AUTH][LOGIN][ERROR]', e);
    next(e);
  }
});

// --- Google OAuth ---
router.post('/oauth/google', async (req, res, next) => {
  try {
    const credential = req.body?.credential || req.body?.token || null;
    if (!credential) {
      return res.status(400).json({ error: 'Missing credential' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.email_verified) {
      return res.status(401).json({ error: 'Email not verified by Google' });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split('@')[0];
    let picture = payload.picture || '';

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      if (!picture) picture = defaultAvatar(name, email);

      user = await User.create({
        name,
        email,
        passwordHash,
        avatarUrl: picture
      });
      if (!isProd) console.log('[AUTH][GOOGLE] created user', user._id.toString());
    } else {
      if (!user.avatarUrl) {
        user.avatarUrl = picture || defaultAvatar(name, email);
        await user.save();
      }
      if (!isProd) console.log('[AUTH][GOOGLE] existing user login', user._id.toString());
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token
    });
  } catch (e) {
    if (!isProd) console.error('[AUTH][GOOGLE][ERROR]', e);
    next(e);
  }
});

// --- Debug route ---
router.get('/_debug/users', async (req, res) => {
  if (isProd) return res.status(404).end();
  const users = await User.find()
    .select('email name avatarUrl createdAt')
    .sort({ createdAt: -1 })
    .limit(10);
  res.json({ count: users.length, users });
});

module.exports = router;
