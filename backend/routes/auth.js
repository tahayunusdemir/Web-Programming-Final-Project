const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model

// @route   POST api/auth/register
// @desc    New user registration
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // 1. Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'This username already exists.' });
    }

    // 2. Create new user (password will be hashed with pre-save hook in the model)
    user = new User({
      username,
      password, // Password is plain text here, will be hashed in the model
      role      // If role is not specified, default value from model will be used
    });

    // 3. Save user to the database
    await user.save();

    // 4. Create JWT (optional, for automatic login after registration)
    // In this example, we don't return token directly after registration, user must login.
    // If desired, the token creation part below can also be added here.

    res.status(201).json({ message: 'User registered successfully.', userId: user.id });

  } catch (err) {
    console.error(err.message);
    // Check if it's a Mongoose validation error
    if (err.name === 'ValidationError') {
        let errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
        return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).send('Server Error (registration)');
  }
});

// @route   POST api/auth/login
// @desc    User login and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (user not found).' });
    }

    // 2. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (wrong password).' });
    }

    // 3. Create JWT
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Secret key from .env file
      { expiresIn: '1h' }, // Token expiration time (e.g., 1 hour)
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login successful!',
          token,
          user: { // We can also return user information (except password)
            id: user.id,
            username: user.username,
            role: user.role
          }
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error (login)');
  }
});

module.exports = router; 