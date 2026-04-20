const bookUseCases = require('../../application/use-cases/bookUseCases');
const logger = require('../../infrastructure/logging/logger');

const getBooks = (req, res) => {
  res.json(bookUseCases.getBooks());
};

const addBook = (req, res) => {
  try {
    const book = bookUseCases.addBook(req.body);
    logger.info(`Book added: ${book.title}`);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateBook = (req, res) => {
  try {
    const book = bookUseCases.updateBook(req.params.id, req.body);
    logger.info(`Book updated: ${book.id}`);
    res.json(book);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const deleteBook = (req, res) => {
  try {
    const book = bookUseCases.deleteBook(req.params.id);
    logger.info(`Book deleted: ${book.id}`);
    res.json(book);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getBooks, addBook, updateBook, deleteBook };
