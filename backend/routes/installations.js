const express = require('express');
const router = express.Router();
const Installation = require('../models/Installation');
const User = require('../models/User'); // To verify client exists
const jwt = require('jsonwebtoken');

// Middleware to protect routes and verify token
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
      console.error('JWT payload is missing user information or in unexpected format:', decoded);
      return res.status(401).json({ message: 'Token is invalid (payload format error).' });
    }
    req.user = decoded.user; // Add user from payload to request object
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

// Middleware for routes strictly for Clients
const clientAuthMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. User is not a client.' });
  }
};

// @route   POST api/installations/register
// @desc    Register a new solar panel installation
// @access  Private (Client only)
router.post('/register', authMiddleware, clientAuthMiddleware, async (req, res) => {
  const {
    address,
    city,
    postalCode,
    panelModel,
    panelCount,
    installationDate,
    notes
  } = req.body;
  const clientId = req.user.id; // Get client ID from authenticated user

  try {
    // Verify the client (user) exists - though authMiddleware should suffice if user ID is trusted
    const clientExists = await User.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ message: 'Client user not found.' });
    }

    const newInstallation = new Installation({
      clientId,
      address,
      city,
      postalCode,
      panelModel,
      panelCount,
      installationDate,
      notes,
    });

    await newInstallation.save();
    res.status(201).json({ 
      message: 'Solar panel installation registered successfully. It is pending approval.',
      installation: newInstallation 
    });

  } catch (err) {
    console.error('Error during installation registration:', err.message);
    if (err.name === 'ValidationError') {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).send('Server Error (installation registration)');
  }
});

module.exports = router; 