const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

// Input Sanitization and Validation Rules
const userValidation = [
  body('name').trim().escape().notEmpty().withMessage('Name is required'),
  body('email').trim().normalizeEmail().isEmail().withMessage('Please provide a valid email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['student', 'librarian']).withMessage('Role must be either student or librarian')
];

const userUpdateValidation = [
  body('name').optional().trim().escape().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().trim().normalizeEmail().isEmail().withMessage('Please provide a valid email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['student', 'librarian']).withMessage('Role must be either student or librarian')
];

// All user management routes are restricted to librarian only
router.use(authMiddleware);
router.use(roleMiddleware('librarian'));

router.post('/', userValidation, UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', userUpdateValidation, UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
