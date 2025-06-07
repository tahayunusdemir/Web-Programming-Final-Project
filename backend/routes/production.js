const express = require('express');
const router = express.Router();
const { recordProduction, getClientProduction } = require('../controllers/productionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/production/:idClient
// @desc    Record energy production for a client
// @access  Private/Operations Manager
router.post('/:idClient', protect, authorize('Operations Manager'), recordProduction);

// @route   GET /api/production/:idClient
// @desc    Get all production data for a client
// @access  Private/Operations Manager
router.get('/:idClient', protect, authorize('Operations Manager'), getClientProduction);

module.exports = router; 