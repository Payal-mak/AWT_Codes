const Item = require('../models/Item');
const Claim = require('../models/Claim');
const AppError = require('../middlewares/AppError');

const itemController = {
    // List all items
    async listItems(req, res, next) {
        try {
            const items = await Item.getAll();
            res.render('items/index', { title: 'All Items', items });
        } catch (err) {
            next(err);
        }
    },

    // Show add item form
    showAddForm(req, res) {
        res.render('items/add', {
            title: 'Add Item',
            errors: [],
            formData: {}
        });
    },

    // Create a new item
    async createItem(req, res, next) {
        try {
            await Item.create(req.body);
            res.redirect('/items');
        } catch (err) {
            // If validation middleware already caught this, pass it through
            if (err instanceof AppError) return next(err);
            next(new AppError(err.message, 500));
        }
    },

    // Show edit item form
    async showEditForm(req, res, next) {
        try {
            const item = await Item.getById(req.params.id);
            if (!item) {
                return next(new AppError('Item not found', 404));
            }
            res.render('items/edit', {
                title: 'Edit Item',
                item,
                errors: [],
                formData: item
            });
        } catch (err) {
            next(err);
        }
    },

    // Update an item
    async updateItem(req, res, next) {
        try {
            const affected = await Item.update(req.params.id, req.body);
            if (!affected) {
                return next(new AppError('Item not found or nothing changed', 404));
            }
            res.redirect('/items');
        } catch (err) {
            if (err instanceof AppError) return next(err);
            next(new AppError(err.message, 500));
        }
    },

    // Delete an item
    async deleteItem(req, res, next) {
        try {
            await Item.delete(req.params.id);
            res.redirect('/items');
        } catch (err) {
            next(err);
        }
    },

    // Show item detail with its claims
    async showItemDetail(req, res, next) {
        try {
            const item = await Item.getById(req.params.id);
            if (!item) {
                return next(new AppError('Item not found', 404));
            }
            const claims = await Claim.getByItemId(req.params.id);
            res.render('items/show', { title: item.name, item, claims });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = itemController;
