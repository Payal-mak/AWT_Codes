const Book = require('../../domain/entities/Book');

const booksDb = []; // In-memory mock database

class BookRepository {
  static async findAll() {
    return booksDb.map(b => new Book(b));
  }

  static async findById(id) {
    const book = booksDb.find(b => b.id === id);
    if (!book) return null;
    return new Book(book);
  }

  static async search(query) {
    const lowerQuery = query.toLowerCase();
    return booksDb
      .filter(b => 
        b.title.toLowerCase().includes(lowerQuery) || 
        b.author.toLowerCase().includes(lowerQuery) || 
        b.genre.toLowerCase().includes(lowerQuery)
      )
      .map(b => new Book(b));
  }

  static async save(book) {
    // If id exists in DB, update, else push
    const index = booksDb.findIndex(b => b.id === book.id);
    if (index !== -1) {
      booksDb[index] = book;
    } else {
      booksDb.push(book);
    }
    return new Book(book);
  }

  static async delete(id) {
    const index = booksDb.findIndex(b => b.id === id);
    if (index !== -1) {
      const deletedBook = booksDb.splice(index, 1)[0];
      return new Book(deletedBook);
    }
    return null;
  }
}

module.exports = BookRepository;
