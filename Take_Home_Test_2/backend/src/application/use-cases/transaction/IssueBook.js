const crypto = require('crypto');
const Transaction = require('../../../domain/entities/Transaction');
const TransactionRepository = require('../../../infrastructure/repositories/TransactionRepository');
const BookRepository = require('../../../infrastructure/repositories/BookRepository');
const UserRepository = require('../../../infrastructure/repositories/UserRepository');
const logger = require('../../../infrastructure/logger/winston');

class IssueBook {
  static async execute({ userId, bookId }) {
    try {
      // Validate user
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate book and availability
      const book = await BookRepository.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      
      if (book.availableCopies <= 0) {
        throw new Error('Book is currently unavailable');
      }

      // Modify Book availability
      book.availableCopies -= 1;
      await BookRepository.save(book);

      // Create transaction
      const id = crypto.randomUUID ? crypto.randomUUID() : 'trx_' + Date.now();
      const transaction = new Transaction({ id, userId, bookId });
      const savedTransaction = await TransactionRepository.save(transaction);
      
      logger.info(`Transaction UseCase [IssueBook]: Book ${bookId} issued to User ${userId}. Transaction ID: ${savedTransaction.id}`);
      return savedTransaction;
    } catch (error) {
      logger.error(`Transaction Error [IssueBook] User ${userId}, Book ${bookId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = IssueBook;
