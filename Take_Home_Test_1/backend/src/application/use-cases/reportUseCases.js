const { transactions } = require('../../infrastructure/repositories');

const getOverdueBooks = async () => {
  const allTransactions = await transactions.findAll();
  const currentDate = new Date();
  return allTransactions.filter(t => t.status === 'issued' && new Date(t.dueDate) < currentDate);
};

const getTransactionHistory = async () => {
  return await transactions.findAll();
};

module.exports = { getOverdueBooks, getTransactionHistory };
