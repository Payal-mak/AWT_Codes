const { transactions, books } = require('../../infrastructure/repositories');

const issueBook = async (bookId, userId) => {
  const isAvailable = await books.checkBookAvailability(bookId);
  if (!isAvailable) {
    const book = await books.findById(bookId);
    if (!book) throw new Error('Book not found');
    throw new Error('Book not available');
  }

  await books.updateBookStockOnIssue(bookId, true);
  
  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const transaction = await transactions.create({
    bookId,
    userId,
    issueDate,
    dueDate,
    status: 'issued'
  });
  
  return transaction;
};

const renewBook = async (transactionId) => {
  const transaction = await transactions.findById(transactionId);
  if (!transaction) throw new Error('Transaction not found');
  if (transaction.status !== 'issued') throw new Error('Book already returned or overdue is locked');

  const newDueDate = new Date(transaction.dueDate);
  newDueDate.setDate(newDueDate.getDate() + 14);
  
  return await transactions.update(transactionId, { dueDate: newDueDate });
};

const returnBook = async (transactionId) => {
  const transaction = await transactions.findById(transactionId);
  if (!transaction) throw new Error('Transaction not found');
  if (transaction.status === 'returned') throw new Error('Book already returned');

  const returnDate = new Date();
  const updatedTransaction = await transactions.update(transactionId, {
    status: 'returned',
    returnDate
  });

  const bookIdToUpdate = transaction.bookId._id || transaction.bookId;
  await books.updateBookStockOnIssue(bookIdToUpdate, false);

  return updatedTransaction;
};

const getTransactions = async () => {
  return await transactions.findAll();
};

module.exports = { issueBook, renewBook, returnBook, getTransactions };
