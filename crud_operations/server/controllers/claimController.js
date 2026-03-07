const Claim = require('../models/Claim');
const Item = require('../models/Item');
const AppError = require('../middlewares/AppError');

const claimController = {
    // GET /api/claims
    async listClaims(req, res, next) {
        try {
            const claims = await Claim.getAll();
            res.json({ success: true, data: claims });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/claims/:id
    async getClaim(req, res, next) {
        try {
            const claim = await Claim.getById(req.params.id);
            if (!claim) {
                return next(new AppError('Claim not found', 404));
            }
            res.json({ success: true, data: claim });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/claims
    async createClaim(req, res, next) {
        try {
            const id = await Claim.create(req.body);
            res.status(201).json({ success: true, data: { id } });
        } catch (err) {
            if (err instanceof AppError) return next(err);
            next(new AppError(err.message, 500));
        }
    },

    // PUT /api/claims/:id
    async updateClaim(req, res, next) {
        try {
            const affected = await Claim.update(req.params.id, req.body);
            if (!affected) {
                return next(new AppError('Claim not found', 404));
            }
            res.json({ success: true, message: 'Claim updated' });
        } catch (err) {
            if (err instanceof AppError) return next(err);
            next(new AppError(err.message, 500));
        }
    },

    // DELETE /api/claims/:id
    async deleteClaim(req, res, next) {
        try {
            await Claim.delete(req.params.id);
            res.json({ success: true, message: 'Claim deleted' });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/claims/:id/approve
    async approveClaim(req, res, next) {
        try {
            await Claim.approve(req.params.id);
            res.json({ success: true, message: 'Claim approved and item marked as resolved' });
        } catch (err) {
            if (err.message === 'Claim not found') {
                return next(new AppError('Claim not found', 404));
            }
            next(new AppError(err.message, 500));
        }
    }
};

module.exports = claimController;
