const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// List all items
router.get('/', itemController.listItems);

// Show add item form
router.get('/add', itemController.showAddForm);

// Create a new item
router.post('/add', itemController.createItem);

// Show edit item form (must be before /:id)
router.get('/edit/:id', itemController.showEditForm);

// Update an item
router.post('/edit/:id', itemController.updateItem);

// Delete an item
router.post('/delete/:id', itemController.deleteItem);

// Show item detail with claims
router.get('/:id', itemController.showItemDetail);

module.exports = router;
