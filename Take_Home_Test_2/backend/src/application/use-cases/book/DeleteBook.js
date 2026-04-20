const BookRepository = require('../../../infrastructure/repositories/BookRepository');
const logger = require('../../../infrastructure/logger/winston');

class DeleteBook {
  static async execute(id) {
    try {
      const deletedBook = await BookRepository.delete(id);
      if (!deletedBook) {
        throw new Error('Book not found');
      }

      logger.info(`Book UseCase [DeleteBook]: Deleted book ID ${id}`);
      return deletedBook;
    } catch (error) {
      logger.error(`Book Error [DeleteBook] on ID ${id}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = DeleteBook;
