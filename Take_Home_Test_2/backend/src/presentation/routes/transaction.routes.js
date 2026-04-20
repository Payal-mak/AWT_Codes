const express = require('express');
const { body } = require('express-validator');
const TransactionController = require('../controllers/TransactionController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

const issueValidation = [
  body('userId').trim().escape().notEmpty().withMessage('User ID is required'),
  body('bookId').trim().escape().notEmpty().withMessage('Book ID is required')
];

const actionValidation = [
  body('transactionId').trim().escape().notEmpty().withMessage('Transaction ID is required')
];

// All routes require authentication
router.use(authMiddleware);

// issue and return are librarian only
router.post('/issue', roleMiddleware('librarian'), issueValidation, TransactionController.issue);
router.post('/return', roleMiddleware('librarian'), actionValidation, TransactionController.returnBook);

// Renew could be done by both librarian OR student (the controller will handle finding it)
router.post('/renew', actionValidation, TransactionController.renew);

// View history (logic in controller: student sees theirs, librarian sees all)
router.get('/history', TransactionController.getHistory);

module.exports = router;
