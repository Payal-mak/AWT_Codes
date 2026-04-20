const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: [true, 'Total copies count is required'],
    min: [0, 'Total copies cannot be negative']
  },
  availableCopies: {
    type: Number,
    required: [true, 'Available copies count is required'],
    min: [0, 'Available copies cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', BookSchema);
