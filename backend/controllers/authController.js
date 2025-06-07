const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// It's highly recommended to use environment variables for your JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'a_super_secret_key_that_is_long_enough';

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all users with role 'Client'
// @route   GET /api/auth/clients
// @access  Private/Operations Manager
exports.getClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'Client' }).select('-password');
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}; 