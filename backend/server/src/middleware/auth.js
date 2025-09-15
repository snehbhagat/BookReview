const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function attachUser(req, res, next) {
  try {
    if (!req.user?.id) return next();
    req.currentUser = await User.findById(req.user.id).select('-passwordHash');
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { authRequired, attachUser };
