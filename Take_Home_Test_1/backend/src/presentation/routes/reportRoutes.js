const express = require('express');
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/overdue', authenticate, authorize(['librarian']), reportController.getOverdueBooks);
router.get('/history', authenticate, authorize(['librarian']), reportController.getTransactionHistory);

module.exports = router;