/**
 * validate.js — Server-side input validation middleware
 *
 * Exports two middleware functions:
 *   validateItem  — used on POST /items/add and POST /items/edit/:id
 *   validateClaim — used on POST /claims/add and POST /claims/edit/:id
 *
 * On failure: passes an AppError(message, 422, details) to next().
 *             The controller re-renders the form with errors + repopulated formData.
 */
const AppError = require('./AppError');

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Trims a value and checks it is non-empty */
function notEmpty(val) {
    return typeof val === 'string' && val.trim().length > 0;
}

/** Checks that a value, when parsed as an integer, is a positive number */
function isPositiveInt(val) {
    const n = parseInt(val, 10);
    return !isNaN(n) && n > 0;
}

// ─── Item Validator ──────────────────────────────────────────────────────────

/**
 * Validates the body of an item form submission.
 * Required: name (non-empty, ≤ 100 chars)
 * Optional: status must be one of found | lost | resolved
 */
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

// ─── Claim Validator ─────────────────────────────────────────────────────────

/**
 * Validates the body of a claim form submission.
 * Required: item_id (positive integer), claimant_name (non-empty, ≤ 100 chars)
 */
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
