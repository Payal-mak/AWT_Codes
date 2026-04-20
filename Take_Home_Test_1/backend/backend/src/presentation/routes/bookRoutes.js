const express = require('express');
const bookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, bookController.getBooks);
router.post('/', authenticate, authorize(['librarian']), bookController.addBook);
router.put('/:id', authenticate, authorize(['librarian']), bookController.updateBook);
router.delete('/:id', authenticate, authorize(['librarian']), bookController.deleteBook);

module.exports = router;
