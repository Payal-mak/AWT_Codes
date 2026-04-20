class Transaction {
  constructor({ id, userId, bookId, issueDate, dueDate, returnDate, status, fine }) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.issueDate = issueDate || new Date();
    
    if (!dueDate) {
      const defaultDueDate = new Date(this.issueDate);
      defaultDueDate.setDate(defaultDueDate.getDate() + 14); // 14 days by default
      this.dueDate = defaultDueDate;
    } else {
      this.dueDate = new Date(dueDate);
    }
    
    this.returnDate = returnDate ? new Date(returnDate) : null;
    this.status = status || 'issued'; // 'issued', 'renewed', 'returned'
    this.fine = fine || 0;
  }
}

module.exports = Transaction;
