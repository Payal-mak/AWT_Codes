const bcrypt = require('bcryptjs');
const User = require('../../domain/entities/User');
const Book = require('../../domain/entities/Book');

const users = [
  new User('1', 'Admin Librarian', 'admin@lib.com', bcrypt.hashSync('admin123', 10), 'librarian')
];
const books = [];
const transactions = [];

module.exports = {
  users,
  books,
  transactions
};
