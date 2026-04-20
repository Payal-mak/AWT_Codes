const express = require('express');
const { body, validationResult } = require('express-validator');
const bookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', authenticate, bookController.getBooks);
router.get('/:id', authenticate, bookController.getBookById);

router.post('/', authenticate, authorize(['librarian']), [
  body('title').notEmpty(),
  body('author').notEmpty(),
  body('isbn').notEmpty(),
  body('totalCopies').isInt({ min: 1 }),
  validate
], bookController.addBook);

router.put('/:id', authenticate, authorize(['librarian']), bookController.updateBook);
router.delete('/:id', authenticate, authorize(['librarian']), bookController.deleteBook);

module.exports = router;