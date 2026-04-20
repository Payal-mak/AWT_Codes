const { transactions, books } = require('../../infrastructure/repositories');
const Transaction = require('../../domain/entities/Transaction');

const issueBook = (bookId, userId) => {
  const book = books.find(b => b.id === bookId);
  if (!book) throw new Error('Book not found');
  if (book.availableCopies <= 0) throw new Error('Book not available');

  book.availableCopies -= 1;
  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const transaction = new Transaction(Date.now().toString(), bookId, userId, issueDate, dueDate, null, 'issued');
  transactions.push(transaction);
  return transaction;
};

const renewBook = (transactionId) => {
  const transaction = transactions.find(t => t.id === transactionId);
  if (!transaction) throw new Error('Transaction not found');
  if (transaction.status !== 'issued') throw new Error('Book already returned or overdue is locked');

  const newDueDate = new Date(transaction.dueDate);
  newDueDate.setDate(newDueDate.getDate() + 14);
  transaction.dueDate = newDueDate;
  return transaction;
};

const returnBook = (transactionId) => {
  const transaction = transactions.find(t => t.id === transactionId);
  if (!transaction) throw new Error('Transaction not found');
  if (transaction.status === 'returned') throw new Error('Book already returned');

  transaction.status = 'returned';
  transaction.returnDate = new Date();

  const book = books.find(b => b.id === transaction.bookId);
  if (book) book.availableCopies += 1;

  return transaction;
};

const getTransactions = () => transactions;

module.exports = { issueBook, renewBook, returnBook, getTransactions };