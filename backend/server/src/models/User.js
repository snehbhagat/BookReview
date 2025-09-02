const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);