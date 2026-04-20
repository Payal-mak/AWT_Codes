const BookRepository = require('../../../infrastructure/repositories/BookRepository');
const logger = require('../../../infrastructure/logger/winston');

class ReadBook {
  static async execute(id) {
    try {
      if (id) {
        const book = await BookRepository.findById(id);
        if (!book) {
          throw new Error('Book not found');
        }
        logger.info(`Book UseCase [ReadBook]: Read book ID ${id}`);
        return book;
      }
      
      const books = await BookRepository.findAll();
      logger.info(`Book UseCase [ReadBook]: Retrieved all books`);
      return books;
    } catch (error) {
      logger.error(`Book Error [ReadBook]: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ReadBook;
