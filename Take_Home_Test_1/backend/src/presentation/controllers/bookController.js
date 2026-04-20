const bookUseCases = require('../../application/use-cases/bookUseCases');
const logger = require('../../infrastructure/logging/logger');

const getBooks = async (req, res) => {
  try {
    const books = await bookUseCases.getBooks();
    res.json(books);
  } catch (err) {
    logger.error(`Error fetching books: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await bookUseCases.getBookById(req.params.id);
    res.json(book);
  } catch (err) {
    logger.error(`Error fetching book: ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

const addBook = async (req, res) => {
  try {
    const book = await bookUseCases.addBook(req.body);
    logger.info(`Book added: ${book.title}`);
    res.status(201).json(book);
  } catch (err) {
    logger.error(`Error adding book: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await bookUseCases.updateBook(req.params.id, req.body);
    logger.info(`Book updated: ${book._id || book.id}`);
    res.json(book);
  } catch (err) {
    logger.error(`Error updating book: ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await bookUseCases.deleteBook(req.params.id);
    logger.info(`Book deleted: ${book._id || book.id}`);
    res.json(book);
  } catch (err) {
    logger.error(`Error deleting book: ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };
