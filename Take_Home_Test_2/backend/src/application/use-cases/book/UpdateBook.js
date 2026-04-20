const Book = require('../../../domain/entities/Book');
const BookRepository = require('../../../infrastructure/repositories/BookRepository');
const logger = require('../../../infrastructure/logger/winston');

class UpdateBook {
  static async execute(id, updateData) {
    try {
      const existingBook = await BookRepository.findById(id);
      if (!existingBook) {
        throw new Error('Book not found');
      }

      // Merge existing data with updates
      const updatedBookData = { ...existingBook, ...updateData, id };
      const updatedBook = new Book(updatedBookData);

      const savedBook = await BookRepository.save(updatedBook);
      
      logger.info(`Book UseCase [UpdateBook]: Updated book ID ${id}`);
      return savedBook;
    } catch (error) {
      logger.error(`Book Error [UpdateBook] on ID ${id}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = UpdateBook;
