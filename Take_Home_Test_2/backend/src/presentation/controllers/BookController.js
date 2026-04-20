const CreateBook = require('../../application/use-cases/book/CreateBook');
const ReadBook = require('../../application/use-cases/book/ReadBook');
const UpdateBook = require('../../application/use-cases/book/UpdateBook');
const DeleteBook = require('../../application/use-cases/book/DeleteBook');
const SearchBooks = require('../../application/use-cases/book/SearchBooks');
const { validationResult } = require('express-validator');

class BookController {
  static async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const bookData = req.body;
      const newBook = await CreateBook.execute(bookData);
      res.status(201).json({ success: true, message: 'Book created', data: newBook });
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrSearch(req, res, next) {
    try {
      const { query } = req.query;
      let books;
      if (query) {
        books = await SearchBooks.execute(query);
      } else {
        books = await ReadBook.execute(); // No ID implies get all
      }
      res.status(200).json({ success: true, data: books });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await ReadBook.execute(id);
      res.status(200).json({ success: true, data: book });
    } catch (error) {
      if (error.message === 'Book not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedBook = await UpdateBook.execute(id, updateData);
      res.status(200).json({ success: true, message: 'Book updated', data: updatedBook });
    } catch (error) {
      if (error.message === 'Book not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedBook = await DeleteBook.execute(id);
      res.status(200).json({ success: true, message: 'Book deleted', data: deletedBook });
    } catch (error) {
      if (error.message === 'Book not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
}

module.exports = BookController;
