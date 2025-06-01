const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios'); // To make requests to the mock API
const User = require('../models/User'); // To verify client exists

// Middleware to protect routes and check for 'operationsManager' role
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token is not in Bearer format.' });
  }
  const token = tokenParts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.user || !decoded.user.id || !decoded.user.role) {
      return res.status(401).json({ message: 'Token is invalid (payload format error).' });
    }
    req.user = decoded.user;
    if (req.user.role !== 'operationsManager') {
      return res.status(403).json({ message: 'Access denied. User is not an Operations Manager.' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

// @route   GET api/production/:idClient
// @desc    Get energy production data for a specific client
// @access  Private (Operations Manager only)
router.get('/:idClient', authMiddleware, async (req, res) => {
  const { idClient } = req.params;

  try {
    // 1. Verify the client exists in the database
    const client = await User.findById(idClient);
    if (!client || client.role !== 'client') {
      return res.status(404).json({ message: 'Client not found.' });
    }

    // 2. Make a GET request to the mock Customer API
    // The URL for the mock API should ideally be in an environment variable
    const mockApiUrl = process.env.MOCK_CUSTOMER_API_URL || 'http://localhost:5002';
    const productionResponse = await axios.get(`${mockApiUrl}/production`);

    // 3. Respond with the data from the mock API
    // You might want to store this reading in your main DB as well, as per Sprint3.md diagram
    // For now, just returning it.
    res.json({
      clientId: idClient,
      clientUsername: client.username,
      energyProduction: productionResponse.data 
    });

  } catch (error) {
    console.error('Error fetching production data:', error.message);
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return res.status(error.response.status).json({ message: error.response.data.message || 'Error from mock API' });
    }
    res.status(500).send('Server Error (production data)');
  }
});

module.exports = router; 