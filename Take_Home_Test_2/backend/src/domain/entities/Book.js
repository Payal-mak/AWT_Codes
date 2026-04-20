class Book {
  constructor({ id, title, author, isbn, publishedYear, genre, availableCopies, totalCopies }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publishedYear = publishedYear;
    this.genre = genre;
    this.totalCopies = totalCopies;
    this.availableCopies = availableCopies !== undefined ? availableCopies : totalCopies;
  }
}

module.exports = Book;
