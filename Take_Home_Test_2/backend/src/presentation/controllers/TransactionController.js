const IssueBook = require('../../application/use-cases/transaction/IssueBook');
const RenewBook = require('../../application/use-cases/transaction/RenewBook');
const ReturnBook = require('../../application/use-cases/transaction/ReturnBook');
const TransactionRepository = require('../../infrastructure/repositories/TransactionRepository');
const { validationResult } = require('express-validator');

class TransactionController {
  static async issue(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { userId, bookId } = req.body;
      const transaction = await IssueBook.execute({ userId, bookId });
      res.status(201).json({ success: true, message: 'Book issued successfully', data: transaction });
    } catch (error) {
      if (['User not found', 'Book not found', 'Book is currently unavailable'].includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async renew(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { transactionId } = req.body;
      const transaction = await RenewBook.execute({ transactionId });
      res.status(200).json({ success: true, message: 'Book renewed successfully', data: transaction });
    } catch (error) {
      if (['Transaction not found', 'Book has already been returned. Cannot be renewed.'].includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async returnBook(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { transactionId } = req.body;
      const transaction = await ReturnBook.execute({ transactionId });
      let msg = 'Book returned successfully.';
      if (transaction.fine > 0) msg += ` Fine applied: ${transaction.fine}`;

      res.status(200).json({ success: true, message: msg, data: transaction });
    } catch (error) {
      if (['Transaction not found', 'Book has already been returned.'].includes(error.message)) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async getHistory(req, res, next) {
    try {
      // If librarian and queries explicit userId, return that
      // If student, filter by their own id
      let userIdFilter = req.query.userId || null;
      
      if (req.user.role === 'student') {
        userIdFilter = req.user.id;
      }

      let history;
      if (userIdFilter) {
        history = await TransactionRepository.findByUserId(userIdFilter);
      } else {
        // Librarian pulling all
        history = await TransactionRepository.findAll();
      }

      res.status(200).json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
