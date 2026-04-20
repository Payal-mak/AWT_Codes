const reportUseCases = require('../../application/use-cases/reportUseCases');

const getOverdueBooks = (req, res) => {
  const overdue = reportUseCases.getOverdueBooks();
  res.json(overdue);
};

const getTransactionHistory = (req, res) => {
  const history = reportUseCases.getTransactionHistory();
  res.json(history);
};

module.exports = { getOverdueBooks, getTransactionHistory };
