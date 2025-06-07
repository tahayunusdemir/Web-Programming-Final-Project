const Production = require('../models/Production');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

const MONTHLY_CONSUMPTION_PLACEHOLDER = 200; // kWh

// @desc    Calculate and award monthly credits for a client
// @route   POST /api/credits/:idClient/calculate
// @access  Private/Operations Manager
exports.calculateAndAwardCredits = async (req, res) => {
    try {
        const { idClient } = req.params;

        // Check if the client exists
        const client = await User.findById(idClient);
        if (!client || client.role !== 'Client') {
            return res.status(404).json({ msg: 'Client not found' });
        }

        // Calculate total production for the last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const productionRecords = await Production.find({
            client: idClient,
            timestamp: { $gte: oneMonthAgo },
        });

        const totalProduction = productionRecords.reduce((acc, record) => acc + record.kilowatt, 0);

        // Calculate surplus and credits (1 kWh = 1 credit)
        const surplus = totalProduction - MONTHLY_CONSUMPTION_PLACEHOLDER;
        const creditsAwarded = Math.max(0, surplus);

        if (creditsAwarded > 0) {
            client.credits += creditsAwarded;
            await client.save();
            notificationService.sendCreditNotification(client, creditsAwarded);
        }

        res.json({
            totalProduction,
            consumption: MONTHLY_CONSUMPTION_PLACEHOLDER,
            surplus,
            creditsAwarded,
            newCreditTotal: client.credits,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}; 