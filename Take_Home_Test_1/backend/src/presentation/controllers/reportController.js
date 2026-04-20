const reportUseCases = require('../../application/use-cases/reportUseCases');

const getOverdueBooks = (req, res) => {
  res.json(reportUseCases.getOverdueBooks());
};

const getTransactionHistory = (req, res) => {
  res.json(reportUseCases.getTransactionHistory());
};

module.exports = { getOverdueBooks, getTransactionHistory };