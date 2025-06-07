const express = require('express');
const router = express.Router();
const { calculateAndAwardCredits } = require('../controllers/creditController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/credits/:idClient/calculate
// @desc    Calculate and award monthly credits for a client
// @access  Private/Operations Manager
router.post('/:idClient/calculate', protect, authorize('Operations Manager'), calculateAndAwardCredits);

module.exports = router; 