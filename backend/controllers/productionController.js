const axios = require('axios');
const Production = require('../models/Production');
const User = require('../models/User');

// @desc    Record energy production for a client
// @route   POST /api/production/:idClient
// @access  Private/Operations Manager
exports.recordProduction = async (req, res) => {
    try {
        const { idClient } = req.params;

        // Check if the client exists
        const client = await User.findById(idClient);
        if (!client || client.role !== 'Client') {
            return res.status(404).json({ msg: 'Client not found' });
        }

        // Call the mock customer API
        const response = await axios.get('http://localhost:5002/production');
        const { kilowatt } = response.data;

        // Save the production data
        const production = new Production({
            client: idClient,
            kilowatt: parseFloat(kilowatt),
        });

        await production.save();

        res.json(production);
    } catch (err) {
        console.error(err.message);
        // Check for specific axios error
        if (err.response) {
            return res.status(500).send('Error from mock API');
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Get all production data for a client
// @route   GET /api/production/:idClient
// @access  Private/Operations Manager
exports.getClientProduction = async (req, res) => {
    try {
        const { idClient } = req.params;
        const productionData = await Production.find({ client: idClient }).sort({ timestamp: -1 });
        res.json(productionData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}; 