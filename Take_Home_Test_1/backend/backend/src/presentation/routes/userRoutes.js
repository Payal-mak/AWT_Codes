const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authenticate, userController.getProfile);
router.get('/', authenticate, authorize(['librarian']), userController.getUsers);
router.put('/:id', authenticate, authorize(['librarian']), userController.updateUser);
router.delete('/:id', authenticate, authorize(['librarian']), userController.deleteUser);

module.exports = router;
