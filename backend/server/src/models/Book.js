const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String },
    isbn13: { type: String, index: true },
    coverUrl: { type: String },
    publishedYear: { type: Number },
    authors: [{ type: String, index: true }],
    genres: [{ type: String, index: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    avgRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);