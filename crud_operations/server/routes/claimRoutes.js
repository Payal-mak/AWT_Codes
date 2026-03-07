const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { validateClaim } = require('../middlewares/validate');

router.get('/', claimController.listClaims);
router.get('/:id', claimController.getClaim);
router.post('/', validateClaim, claimController.createClaim);
router.put('/:id', validateClaim, claimController.updateClaim);
router.delete('/:id', claimController.deleteClaim);
router.post('/:id/approve', claimController.approveClaim);

module.exports = router;
