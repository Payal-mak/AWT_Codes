const transactionUseCases = require('../../application/use-cases/transactionUseCases');
const logger = require('../../infrastructure/logging/logger');

const getTransactions = (req, res) => {
  res.json(transactionUseCases.getTransactions());
};

const issueBook = (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const transaction = transactionUseCases.issueBook(bookId, userId);
    logger.info(`Book ${bookId} issued to user ${userId}`);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const renewBook = (req, res) => {
  try {
    const transaction = transactionUseCases.renewBook(req.params.id);
    logger.info(`Transaction renewed: ${transaction.id}`);
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const returnBook = (req, res) => {
  try {
    const transaction = transactionUseCases.returnBook(req.params.id);
    logger.info(`Book returned, transaction: ${transaction.id}`);
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getTransactions, issueBook, renewBook, returnBook };
