const { books } = require('../../infrastructure/repositories');

const getBooks = async () => await books.findAll();

const getBookById = async (id) => {
  const book = await books.findById(id);
  if (!book) throw new Error('Book not found');
  return book;
};

const addBook = async (data) => {
  const book = await books.create({
    title: data.title,
    author: data.author,
    isbn: data.isbn,
    totalCopies: data.totalCopies,
    availableCopies: data.totalCopies
  });
  return book;
};

const updateBook = async (id, data) => {
  const book = await books.findById(id);
  if (!book) throw new Error('Book not found');
  
  if (data.totalCopies !== undefined) {
    const diff = data.totalCopies - book.totalCopies;
    data.availableCopies = book.availableCopies + diff;
  }
  
  const updatedBook = await books.update(id, data);
  return updatedBook;
};

const deleteBook = async (id) => {
  const deleted = await books.delete(id);
  if (!deleted) throw new Error('Book not found');
  return deleted;
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };