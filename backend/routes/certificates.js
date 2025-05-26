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

    // Check if the user has the 'technician' role
    if (req.user.role !== 'technician') {
      return res.status(403).json({ message: 'Access denied. User is not a technician.' });
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

// @route   POST api/certificates/register
// @desc    Register a new certificate for a user
// @access  Private (Technician only)
router.post('/register', authMiddleware, async (req, res) => {
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
// @desc    Search for user records by id or name (for certificate registration)
// @access  Private (Technician only)
router.get('/search', async (req, res) => {
    console.log("--- /api/certificates/search route hit ---"); // Log to server console
    const { query } = req.query; // Get the search query from query parameters

    if (!query) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    try {
      // Search for users by username or ID with the role 'client'
      // For ID search, mongoose.Types.ObjectId.isValid(query) check can be added
      // For now, let's search only by username and role
      const usersFromDB = await User.find({
        username: { $regex: query, $options: 'i' }, // Case-insensitive regex search for username
        role: 'client' // Filter by role 'client'
      }).select('_id username name'); // Select _id, username, and name fields

      if (!usersFromDB.length) {
        // Log to server console if no users found, but still return empty array to client
        console.log(`No client users found matching query: ${query}`);
        return res.status(200).json([]); // Return an empty array if no users are found
      }

      // Transform users to add the id field
      const users = usersFromDB.map(user => ({
        id: user._id.toString(), // Convert _id to string and assign to id
        username: user.username,
        name: user.name || user.username // Use username if name is not available
      }));

      res.status(200).json(users);
    } catch (err) {
      console.error('Error during user search:', err.message);
      res.status(500).send('Server Error (user search)');
    }
});

module.exports = router; 