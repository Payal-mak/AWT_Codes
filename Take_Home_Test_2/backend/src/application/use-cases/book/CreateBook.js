const crypto = require('crypto');
const Book = require('../../../domain/entities/Book');
const BookRepository = require('../../../infrastructure/repositories/BookRepository');
const logger = require('../../../infrastructure/logger/winston');

class CreateBook {
  static async execute(bookData) {
    try {
      const id = crypto.randomUUID ? crypto.randomUUID() : 'book_' + Date.now();
      const newBook = new Book({ ...bookData, id });
      
      const savedBook = await BookRepository.save(newBook);
      
      logger.info(`Book UseCase [CreateBook]: Book created with ID ${savedBook.id} - ${savedBook.title}`);
      return savedBook;
    } catch (error) {
      logger.error(`Book Error [CreateBook]: ${error.message}`);
      throw error;
    }
  }
}

module.exports = CreateBook;
