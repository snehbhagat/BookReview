const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token
    });
  } catch (e) {
    next(e);
  }
});

// ADD: Google Sign-In endpoint
// POST /api/auth/oauth/google   (also available at /auth/oauth/google via alias mount)
router.post('/oauth/google', async (req, res, next) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: 'Missing credential' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.email_verified) {
      return res.status(401).json({ error: 'Email not verified by Google' });
    }

    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const picture = payload.picture || '';

    // Find by email; create user if not found.
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = require('crypto').randomBytes(32).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        name,
        email,
        passwordHash,        // keep schema unchanged
        avatarUrl: picture
      });
    } else {
      let changed = false;
      if (!user.avatarUrl && picture) {
        user.avatarUrl = picture;
        changed = true;
      }
      if (changed) await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;