const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title:   { type: String, required: true },
    author:  { type: String, required: true },
    genre:   { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Book', bookSchema);