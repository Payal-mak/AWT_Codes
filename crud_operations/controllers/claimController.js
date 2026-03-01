const Claim = require('../models/Claim');
const Item = require('../models/Item');

const claimController = {
    // List all claims (with joined item info)
    async listClaims(req, res, next) {
        try {
            const claims = await Claim.getAll();
            res.render('claims/index', { title: 'All Claims', claims });
        } catch (err) {
            next(err);
        }
    },

    // Show add claim form
    async showAddForm(req, res, next) {
        try {
            const items = await Item.getAll();
            const selectedItemId = req.query.item_id || null;
            res.render('claims/add', { title: 'File a Claim', items, selectedItemId });
        } catch (err) {
            next(err);
        }
    },

    // Create a new claim
    async createClaim(req, res, next) {
        try {
            await Claim.create(req.body);
            res.redirect('/claims');
        } catch (err) {
            next(err);
        }
    },

    // Show edit claim form
    async showEditForm(req, res, next) {
        try {
            const claim = await Claim.getById(req.params.id);
            if (!claim) {
                return res.status(404).render('error', { title: 'Not Found', message: 'Claim not found' });
            }
            const items = await Item.getAll();
            res.render('claims/edit', { title: 'Edit Claim', claim, items });
        } catch (err) {
            next(err);
        }
    },

    // Update a claim
    async updateClaim(req, res, next) {
        try {
            await Claim.update(req.params.id, req.body);
            res.redirect('/claims');
        } catch (err) {
            next(err);
        }
    },

    // Delete a claim
    async deleteClaim(req, res, next) {
        try {
            await Claim.delete(req.params.id);
            res.redirect('/claims');
        } catch (err) {
            next(err);
        }
    },

    // Approve a claim (transaction: claim → approved, item → resolved)
    async approveClaim(req, res, next) {
        try {
            await Claim.approve(req.params.id);
            res.redirect('/claims');
        } catch (err) {
            next(err);
        }
    }
};

module.exports = claimController;
