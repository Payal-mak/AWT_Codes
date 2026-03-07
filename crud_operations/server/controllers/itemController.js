const Item = require('../models/Item');
const Claim = require('../models/Claim');
const AppError = require('../middlewares/AppError');

const itemController = {
    // GET /api/items
    async listItems(req, res, next) {
        try {
            const items = await Item.getAll();
            res.json({ success: true, data: items });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/items/:id
    async getItem(req, res, next) {
        try {
            const item = await Item.getById(req.params.id);
            if (!item) {
                return next(new AppError('Item not found', 404));
            }
            const claims = await Claim.getByItemId(req.params.id);
            res.json({ success: true, data: { item, claims } });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/items
    async createItem(req, res, next) {
        try {
            const id = await Item.create(req.body);
            res.status(201).json({ success: true, data: { id } });
        } catch (err) {
            if (err instanceof AppError) return next(err);
            next(new AppError(err.message, 500));
        }
    },

    // PUT /api/items/:id
    async updateItem(req, res, next) {
        try {
            const affected = await Item.update(req.params.id, req.body);
            if (!affected) {
                return next(new AppError('Item not found', 404));
            }
            res.json({ success: true, message: 'Item updated' });
        } catch (err) {
            if (err instanceof AppError) return next(err);
            next(new AppError(err.message, 500));
        }
    },

    // DELETE /api/items/:id
    async deleteItem(req, res, next) {
        try {
            await Item.delete(req.params.id);
            res.json({ success: true, message: 'Item deleted' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = itemController;
