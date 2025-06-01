const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // Check if token is in Bearer format
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token is not in Bearer format.' });
  }
  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload to request object
    // The payload structure depends on how it was created during login
    // Assuming payload.user contains { id, username, role }
    if (!decoded.user || !decoded.user.id || !decoded.user.role) {
        console.error('JWT payload is missing user information or in unexpected format:', decoded);
        return res.status(401).json({ message: 'Token is invalid (payload format error).' });
    }
    req.user = decoded.user; 

    // Allow technician or operationsManager for specific routes
    // The role check for specific handler functions might need to be more granular
    // if this middleware is used for routes with mixed access.
    // For POST /register, it strictly checks for 'technician' later.
    // For GET /search, we will allow 'technician' OR 'operationsManager'.
    // For GET /user/:userId, it might be technician, operationsManager, or the user themselves.

    // General check: if not one of the allowed roles for any certificate-related action, deny.
    // More specific checks will be done in handlers or a more specific middleware.
    // if (!['technician', 'operationsManager'].includes(req.user.role)) {
    // return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    // }

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

// Middleware for routes strictly for Technicians
const technicianOnlyAuth = (req, res, next) => {
  if (req.user && req.user.role === 'technician') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. User is not a technician.' });
  }
};

// Middleware for routes accessible by Technicians or Operations Managers
const technicianOrManagerAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'technician' || req.user.role === 'operationsManager')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. User is not a technician or operations manager.' });
  }
};

// @route   POST api/certificates/register
// @desc    Register a new certificate for a user
// @access  Private (Technician only)
router.post('/register', authMiddleware, technicianOnlyAuth, async (req, res) => {
  const { userId, userName, certificateFile } = req.body;
  const technicianId = req.user?.id; // Assuming technician's ID is available from auth middleware

  // Basic validation
  if (!userId || !userName || !certificateFile) {
    return res.status(400).json({ message: 'Please provide userId, userName, and certificateFile.' });
  }

  try {
    // 1. Verify the user (client) exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Optionally, verify the userName matches the found user's name if available in User model
    // if (user.name !== userName) { // Assuming User model has a 'name' field
    //   return res.status(400).json({ message: 'Provided userName does not match the user record.' });
    // }

    // 2. Create new certificate
    const newCertificate = new Certificate({
      userId,
      userName, // Storing userName for easier searching/display as per Sprint2.md
      certificateFile, // This would be a path to the PDF file
      issuedBy: technicianId, // ID of the technician registering the certificate
    });

    // 3. Save certificate to the database
    await newCertificate.save();

    res.status(201).json({ message: 'Certificate registered successfully.', certificate: newCertificate });

  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      let errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).send('Server Error (certificate registration)');
  }
});

// @route   GET api/certificates/user/:userId
// @desc    Get certificates for a specific user
// @access  Private (Technician or concerned Client)
router.get('/user/:userId', authMiddleware, async (req, res) => {
    // Add logic to fetch certificates for a user
    // Ensure only authorized users (e.g., the user themselves or a technician/admin) can access
});

// @route   GET api/certificates/search
// @desc    Search for user records by id or name (for certificate registration or production monitoring)
// @access  Private (Technician or Operations Manager)
router.get('/search', authMiddleware, technicianOrManagerAuth, async (req, res) => {
    console.log("--- /api/certificates/search route hit --- (for technicians/managers)"); 
    const { query } = req.query; // Get the search query from query parameters

    // if (!query) {
    //   return res.status(400).json({ message: 'Search query is required.' });
    // }
    // If query is empty, we list all clients. If query is present, we filter.

    try {
      const searchCriteria = { role: 'client' };
      if (query) {
        // If there is a query, search by username (case-insensitive)
        searchCriteria.username = { $regex: query, $options: 'i' };
      }
      // If query is undefined or empty, it will find all users with role: 'client'

      const usersFromDB = await User.find(searchCriteria)
        .select('_id username name'); // Select _id, username, and name fields

      if (!usersFromDB.length && query) { // Only log "not found" if there was a specific query
        console.log(`No client users found matching query: ${query}`);
        // For an empty query returning no clients, this is valid, so don't log "not found"
      }
      // Always return 200, even if empty (e.g. no clients in system, or no matches for a query)
      const users = usersFromDB.map(user => ({
        id: user._id.toString(),
        username: user.username,
        name: user.name || user.username
      }));

      res.status(200).json(users);
    } catch (err) {
      console.error('Error during user search:', err.message);
      res.status(500).send('Server Error (user search)');
    }
});

module.exports = router; 