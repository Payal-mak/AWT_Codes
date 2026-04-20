const BookRepository = require('../../../infrastructure/repositories/BookRepository');
const logger = require('../../../infrastructure/logger/winston');

class SearchBooks {
  static async execute(query) {
    try {
      if (!query) {
        return await BookRepository.findAll();
      }

      const books = await BookRepository.search(query);
      logger.info(`Book UseCase [SearchBooks]: Searched books with query "${query}"`);
      return books;
    } catch (error) {
      logger.error(`Book Error [SearchBooks] on query "${query}": ${error.message}`);
      throw error;
    }
  }
}

module.exports = SearchBooks;
