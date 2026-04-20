class Book {
  constructor(id, title, author, isbn, availableCopies, totalCopies) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.availableCopies = availableCopies;
    this.totalCopies = totalCopies;
  }
}

module.exports = Book;