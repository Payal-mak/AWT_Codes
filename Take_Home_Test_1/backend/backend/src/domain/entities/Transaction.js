class Transaction {
  constructor(id, bookId, userId, issueDate, dueDate, returnDate, status) {
    this.id = id;
    this.bookId = bookId;
    this.userId = userId;
    this.issueDate = issueDate;
    this.dueDate = dueDate;
    this.returnDate = returnDate;
    this.status = status; // 'issued', 'returned', 'overdue'
  }
}
module.exports = Transaction;
