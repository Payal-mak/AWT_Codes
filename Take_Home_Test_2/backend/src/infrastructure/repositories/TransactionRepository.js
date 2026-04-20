const Transaction = require('../../domain/entities/Transaction');

const transactionsDb = []; // In-memory mock database

class TransactionRepository {
  static async findAll() {
    return transactionsDb.map(t => new Transaction(t));
  }

  static async findById(id) {
    const trx = transactionsDb.find(t => t.id === id);
    if (!trx) return null;
    return new Transaction(trx);
  }

  static async findByUserId(userId) {
    return transactionsDb
      .filter(t => t.userId === userId)
      .map(t => new Transaction(t));
  }

  static async findByBookId(bookId) {
    return transactionsDb
      .filter(t => t.bookId === bookId)
      .map(t => new Transaction(t));
  }

  static async save(transaction) {
    const index = transactionsDb.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      transactionsDb[index] = transaction;
    } else {
      transactionsDb.push(transaction);
    }
    return new Transaction(transaction);
  }
}

module.exports = TransactionRepository;
