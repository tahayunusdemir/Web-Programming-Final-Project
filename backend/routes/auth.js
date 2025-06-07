const express = require('express');
const router = express.Router();
const { login, getClients } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/auth/clients
// @desc    Get all clients
// @access  Private/Operations Manager
router.get('/clients', protect, authorize('Operations Manager'), getClients);

module.exports = router; 