const TransactionRepository = require('../../../infrastructure/repositories/TransactionRepository');
const BookRepository = require('../../../infrastructure/repositories/BookRepository');
const logger = require('../../../infrastructure/logger/winston');

class ReturnBook {
  static async execute({ transactionId }) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status === 'returned') {
        throw new Error('Book has already been returned.');
      }

      // Mark returned
      transaction.returnDate = new Date();
      transaction.status = 'returned';

      // Calculate fine if overdue (e.g. 10 Rs per day)
      const dueTime = new Date(transaction.dueDate).getTime();
      const returnTime = transaction.returnDate.getTime();
      
      if (returnTime > dueTime) {
        const diffTime = Math.abs(returnTime - dueTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        transaction.fine = diffDays * 10;
      }

      // Update book availability
      const book = await BookRepository.findById(transaction.bookId);
      if (book) {
        book.availableCopies += 1;
        await BookRepository.save(book);
      }

      const updatedTransaction = await TransactionRepository.save(transaction);
      
      logger.info(`Transaction UseCase [ReturnBook]: Book returned. Transaction ID ${updatedTransaction.id}. Fine: ${updatedTransaction.fine}`);
      return updatedTransaction;
    } catch (error) {
      logger.error(`Transaction Error [ReturnBook] Transaction ${transactionId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ReturnBook;
