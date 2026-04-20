const express = require('express');
const transactionController = require('../controllers/transactionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, authorize(['librarian']), transactionController.getTransactions);
router.post('/issue', authenticate, authorize(['librarian']), transactionController.issueBook);
router.put('/:id/renew', authenticate, authorize(['librarian', 'student']), transactionController.renewBook);
router.put('/:id/return', authenticate, authorize(['librarian']), transactionController.returnBook);

module.exports = router;