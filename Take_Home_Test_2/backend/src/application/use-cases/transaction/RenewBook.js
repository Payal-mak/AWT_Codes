const TransactionRepository = require('../../../infrastructure/repositories/TransactionRepository');
const logger = require('../../../infrastructure/logger/winston');

class RenewBook {
  static async execute({ transactionId }) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status === 'returned') {
        throw new Error('Book has already been returned. Cannot be renewed.');
      }

      // Extend due date by 14 days
      const currentDueDate = new Date(transaction.dueDate);
      currentDueDate.setDate(currentDueDate.getDate() + 14);
      transaction.dueDate = currentDueDate;
      transaction.status = 'renewed';

      const updatedTransaction = await TransactionRepository.save(transaction);
      
      logger.info(`Transaction UseCase [RenewBook]: Renewed transaction ID ${updatedTransaction.id}. New due date: ${updatedTransaction.dueDate}`);
      return updatedTransaction;
    } catch (error) {
      logger.error(`Transaction Error [RenewBook] Transaction ${transactionId}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = RenewBook;
