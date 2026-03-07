const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { validateClaim } = require('../middlewares/validate');

// List all claims
router.get('/', claimController.listClaims);

// Show add claim form
router.get('/add', claimController.showAddForm);

// Create a new claim  (validate first)
router.post('/add', validateClaim, claimController.createClaim);

// Show edit claim form
router.get('/edit/:id', claimController.showEditForm);

// Update a claim  (validate first)
router.post('/edit/:id', validateClaim, claimController.updateClaim);

// Delete a claim
router.post('/delete/:id', claimController.deleteClaim);

// Approve a claim (transaction)
router.post('/approve/:id', claimController.approveClaim);

module.exports = router;
