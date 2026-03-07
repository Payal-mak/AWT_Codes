const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { validateItem } = require('../middlewares/validate');

// List all items
router.get('/', itemController.listItems);

// Show add item form
router.get('/add', itemController.showAddForm);

// Create a new item  (validate first)
router.post('/add', validateItem, itemController.createItem);

// Show edit item form (must be before /:id)
router.get('/edit/:id', itemController.showEditForm);

// Update an item  (validate first)
router.post('/edit/:id', validateItem, itemController.updateItem);

// Delete an item
router.post('/delete/:id', itemController.deleteItem);

// Show item detail with claims
router.get('/:id', itemController.showItemDetail);

module.exports = router;
