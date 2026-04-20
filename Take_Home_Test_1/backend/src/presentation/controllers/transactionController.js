const transactionUseCases = require('../../application/use-cases/transactionUseCases');
const logger = require('../../infrastructure/logging/logger');

const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionUseCases.getTransactions();
    res.json(transactions);
  } catch (err) {
    logger.error(`Error fetching transactions: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const issueBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const transaction = await transactionUseCases.issueBook(bookId, userId);
    logger.info(`Book ${bookId} issued to user ${userId}`);
    res.status(201).json(transaction);
  } catch (err) {
    logger.error(`Error issuing book: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const renewBook = async (req, res) => {
  try {
    const transaction = await transactionUseCases.renewBook(req.params.id);
    logger.info(`Transaction renewed: ${transaction._id || transaction.id}`);
    res.json(transaction);
  } catch (err) {
    logger.error(`Error renewing book: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const transaction = await transactionUseCases.returnBook(req.params.id);
    logger.info(`Book returned, transaction: ${transaction._id || transaction.id}`);
    res.json(transaction);
  } catch (err) {
    logger.error(`Error returning book: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getTransactions, issueBook, renewBook, returnBook };
