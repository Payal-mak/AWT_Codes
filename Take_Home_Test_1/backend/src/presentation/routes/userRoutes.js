const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/profile', authenticate, userController.getProfile);
router.get('/', authenticate, authorize(['librarian']), userController.getUsers);

router.put('/:id', authenticate, authorize(['librarian']), [
  body('name').optional().notEmpty(),
  body('role').optional().isIn(['student', 'librarian']),
  validate
], userController.updateUser);

router.delete('/:id', authenticate, authorize(['librarian']), userController.deleteUser);

module.exports = router;