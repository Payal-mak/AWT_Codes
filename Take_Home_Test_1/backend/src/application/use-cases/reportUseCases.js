const { transactions } = require('../../infrastructure/repositories');

const getOverdueBooks = () => {
  const currentDate = new Date();
  return transactions.filter(t => t.status === 'issued' && new Date(t.dueDate) < currentDate);
};

const getTransactionHistory = () => {
  return transactions;
};

module.exports = { getOverdueBooks, getTransactionHistory };