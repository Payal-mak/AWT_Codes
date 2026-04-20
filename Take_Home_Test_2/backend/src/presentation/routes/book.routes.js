const express = require('express');
const { body } = require('express-validator');
const BookController = require('../controllers/BookController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// Validation Rules
const bookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Valid published year is required'),
  body('genre').trim().notEmpty().withMessage('Genre is required'),
  body('totalCopies').isInt({ min: 1 }).withMessage('At least 1 total copy is required')
];

// Public or student-accessible routes (Assuming reading is allowed for everyone who is authenticated)
// Usually books can be seen by all authenticated users:
router.use(authMiddleware); 
router.get('/', BookController.getAllOrSearch);
router.get('/:id', BookController.getById);

// Librarian-only routes
router.use(roleMiddleware('librarian'));
router.post('/', bookValidation, BookController.create);
router.put('/:id', bookValidation, BookController.update);
router.delete('/:id', BookController.delete);

module.exports = router;
