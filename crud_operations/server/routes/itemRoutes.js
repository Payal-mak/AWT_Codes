const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { validateItem } = require('../middlewares/validate');

router.get('/', itemController.listItems);
router.get('/:id', itemController.getItem);
router.post('/', validateItem, itemController.createItem);
router.put('/:id', validateItem, itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
