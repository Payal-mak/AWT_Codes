const { books } = require('../../infrastructure/repositories/MockRepositories');
const Book = require('../../domain/entities/Book');

const addBook = (data) => {
  const book = new Book(Date.now().toString(), data.title, data.author, data.isbn, data.totalCopies, data.totalCopies);
  books.push(book);
  return book;
};

const getBooks = () => books;

const updateBook = (id, data) => {
  const book = books.find(b => b.id === id);
  if (!book) throw new Error('Book not found');
  Object.assign(book, data);
  return book;
};

const deleteBook = (id) => {
  const index = books.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Book not found');
  return books.splice(index, 1)[0];
};

module.exports = { addBook, getBooks, updateBook, deleteBook };
