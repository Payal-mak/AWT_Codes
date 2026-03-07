const AppError = require('./AppError');

function notEmpty(val) {
    return typeof val === 'string' && val.trim().length > 0;
}

function isPositiveInt(val) {
    const n = parseInt(val, 10);
    return !isNaN(n) && n > 0;
}

function validateItem(req, res, next) {
    const errors = [];
    const { name, status } = req.body;

    if (!notEmpty(name)) {
        errors.push({ field: 'name', msg: 'Item name is required.' });
    } else if (name.trim().length > 100) {
        errors.push({ field: 'name', msg: 'Item name must be 100 characters or fewer.' });
    }

    const validStatuses = ['found', 'lost', 'resolved'];
    if (status && !validStatuses.includes(status)) {
        errors.push({ field: 'status', msg: `Status must be one of: ${validStatuses.join(', ')}.` });
    }

    if (errors.length > 0) {
        return next(new AppError('Validation failed', 422, errors));
    }

    next();
}

function validateClaim(req, res, next) {
    const errors = [];
    const { item_id, claimant_name } = req.body;

    if (!isPositiveInt(item_id)) {
        errors.push({ field: 'item_id', msg: 'Please select a valid item.' });
    }

    if (!notEmpty(claimant_name)) {
        errors.push({ field: 'claimant_name', msg: 'Claimant name is required.' });
    } else if (claimant_name.trim().length > 100) {
        errors.push({ field: 'claimant_name', msg: 'Claimant name must be 100 characters or fewer.' });
    }

    if (errors.length > 0) {
        return next(new AppError('Validation failed', 422, errors));
    }

    next();
}

module.exports = { validateItem, validateClaim };
