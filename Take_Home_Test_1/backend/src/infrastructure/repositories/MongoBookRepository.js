const Book = require('../database/schemas/BookSchema');
const logger = require('../logging/logger');

class MongoBookRepository {
  async findAll() {
    try {
      return await Book.find({});
    } catch (error) {
      logger.error(`Error finding all books: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Book.findById(id);
    } catch (error) {
      logger.error(`Error finding book by id: ${error.message}`);
      throw error;
    }
  }

  async create(bookData) {
    try {
      const book = new Book(bookData);
      return await book.save();
    } catch (error) {
      logger.error(`Error creating book: ${error.message}`);
      throw error;
    }
  }

  async update(id, bookData) {
    try {
      return await Book.findByIdAndUpdate(id, bookData, { new: true, runValidators: true });
    } catch (error) {
      logger.error(`Error updating book: ${error.message}`);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Book.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting book: ${error.message}`);
      throw error;
    }
  }

  async checkBookAvailability(id) {
    try {
      const book = await Book.findById(id);
      return book && book.availableCopies > 0;
    } catch (error) {
      logger.error(`Error checking book availability: ${error.message}`);
      throw error;
    }
  }

  async updateBookStockOnIssue(id, isIssuing) {
    try {
      const increment = isIssuing ? -1 : 1;
      return await Book.findByIdAndUpdate(
        id,
        { $inc: { availableCopies: increment } },
        { new: true }
      );
    } catch (error) {
      logger.error(`Error updating book stock: ${error.message}`);
      throw error;
    }
  }
}

module.exports = MongoBookRepository;
