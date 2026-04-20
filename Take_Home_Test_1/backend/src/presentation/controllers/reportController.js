const reportUseCases = require('../../application/use-cases/reportUseCases');
const logger = require('../../infrastructure/logging/logger');

const getOverdueBooks = async (req, res) => {
  try {
    const overdue = await reportUseCases.getOverdueBooks();
    res.json(overdue);
  } catch (err) {
    logger.error(`Error getting overdue books: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const history = await reportUseCases.getTransactionHistory();
    res.json(history);
  } catch (err) {
    logger.error(`Error getting transaction history: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getOverdueBooks, getTransactionHistory };
