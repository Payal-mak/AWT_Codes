// ============================================================
// Q3 - middleware/validate.js
// Request validation using express-validator.
// Input sanitization middleware to strip/escape harmful input.
// handleValidation runs after validation chains and returns
// 400 if any errors exist.
// ============================================================

const { body, param, validationResult } = require('express-validator');

// Run after validation chains to send errors if any
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Validation rules for creating/updating a product
const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Name must be ≤ 100 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  handleValidation,
];

// Validation rules for user registration
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['customer', 'seller', 'admin']).withMessage('Role must be customer, seller, or admin'),
  handleValidation,
];

// Validation rules for login
const validateLogin = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// Global sanitization middleware (trim strings, remove dangerous chars)
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Strip script tags and trim
        obj[key] = obj[key].replace(/<script.*?>.*?<\/script>/gi, '').trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
};

module.exports = {
  validateProduct,
  validateRegister,
  validateLogin,
  sanitizeInput,
  handleValidation,
};
