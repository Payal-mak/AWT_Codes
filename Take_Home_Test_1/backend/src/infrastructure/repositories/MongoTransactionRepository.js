const Transaction = require('../database/schemas/TransactionSchema');
const logger = require('../logging/logger');

class MongoTransactionRepository {
  async findAll() {
    try {
      return await Transaction.find({}).populate('bookId').populate('userId');
    } catch (error) {
      logger.error(`Error finding all transactions: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Transaction.findById(id).populate('bookId').populate('userId');
    } catch (error) {
      logger.error(`Error finding transaction by id: ${error.message}`);
      throw error;
    }
  }

  async findByUser(userId) {
    try {
      return await Transaction.find({ userId }).populate('bookId');
    } catch (error) {
      logger.error(`Error finding transactions by user: ${error.message}`);
      throw error;
    }
  }

  async create(transactionData) {
    try {
      const transaction = new Transaction(transactionData);
      return await transaction.save();
    } catch (error) {
      logger.error(`Error creating transaction: ${error.message}`);
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      return await Transaction.findByIdAndUpdate(id, transactionData, { new: true, runValidators: true });
    } catch (error) {
      logger.error(`Error updating transaction: ${error.message}`);
      throw error;
    }
  }

  async findActiveByUser(userId) {
    try {
      return await Transaction.find({ userId, status: { $in: ['issued', 'overdue'] } }).populate('bookId');
    } catch (error) {
      logger.error(`Error finding active transactions for user: ${error.message}`);
      throw error;
    }
  }
}

module.exports = MongoTransactionRepository;
