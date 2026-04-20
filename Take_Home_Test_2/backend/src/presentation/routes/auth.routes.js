const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Validation Rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['student', 'librarian']).withMessage('Role must be either student or librarian')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

// Example of a protected route using JWT middleware
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected route accessed successfully',
    data: { user: req.user }
  });
});

module.exports = router;
