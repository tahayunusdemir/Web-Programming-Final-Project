const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const EnergyCredit = require('../models/EnergyCredit');
const User = require('../models/User'); // User modelini de dahil et

// @route   POST /api/energy-credits
// @desc    Create a new energy credit record
// @access  Private (Operations Manager)
router.post('/', protect, authorize('operationsManager'), async (req, res) => {
  const { clientId, kwhGenerated, creditsEarned, notes } = req.body;

  // Simple validation
  if (!clientId || kwhGenerated === undefined || creditsEarned === undefined) {
    return res.status(400).json({ message: 'Please provide clientId, kwhGenerated, and creditsEarned' });
  }

  try {
    // Check if the client exists
    const clientExists = await User.findById(clientId);
    if (!clientExists || clientExists.role !== 'client') {
      return res.status(404).json({ message: 'Client not found or user is not a client' });
    }

    const newCredit = new EnergyCredit({
      clientId,
      kwhGenerated,
      creditsEarned,
      notes,
      // calculationDate is set by default in the schema
    });

    const savedCredit = await newCredit.save();
    res.status(201).json(savedCredit);
  } catch (error) {
    console.error('Error creating energy credit:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid clientId format' });
    }
    res.status(500).json({ message: 'Server error while creating energy credit', error: error.message });
  }
});

// @route   GET /api/energy-credits/client/:clientId
// @desc    Get all energy credit records for a specific client
// @access  Private (Operations Manager)
router.get('/client/:clientId', protect, authorize('operationsManager'), async (req, res) => {
  try {
    const { clientId } = req.params;

    // Check if the client exists (optional but good practice)
    const clientExists = await User.findById(clientId);
    if (!clientExists || clientExists.role !== 'client') {
      return res.status(404).json({ message: 'Client not found or user is not a client' });
    }

    const credits = await EnergyCredit.find({ clientId }).sort({ calculationDate: -1 }); // Sort from newest to oldest
    if (!credits || credits.length === 0) {
      return res.status(404).json({ message: 'No energy credits found for this client' });
    }
    res.json(credits);
  } catch (error) {
    console.error('Error fetching energy credits by client:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid clientId format' });
    }
    res.status(500).json({ message: 'Server error while fetching energy credits', error: error.message });
  }
});

// @route   GET /api/energy-credits/:creditId
// @desc    Get a specific energy credit record by its ID
// @access  Private (Operations Manager)
router.get('/:creditId', protect, authorize('operationsManager'), async (req, res) => {
  try {
    const { creditId } = req.params;
    const credit = await EnergyCredit.findById(creditId).populate('clientId', 'username name email'); // Also fetch client information

    if (!credit) {
      return res.status(404).json({ message: 'Energy credit record not found' });
    }
    res.json(credit);
  } catch (error) {
    console.error('Error fetching energy credit by ID:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid creditId format' });
    }
    res.status(500).json({ message: 'Server error while fetching energy credit', error: error.message });
  }
});

// @route   PUT /api/energy-credits/:creditId
// @desc    Update an existing energy credit record
// @access  Private (Operations Manager)
router.put('/:creditId', protect, authorize('operationsManager'), async (req, res) => {
  const { kwhGenerated, creditsEarned, notes } = req.body;
  const { creditId } = req.params;

  // Ensure at least one field is provided for update
  if (kwhGenerated === undefined && creditsEarned === undefined && notes === undefined) {
    return res.status(400).json({ message: 'Please provide at least one field to update (kwhGenerated, creditsEarned, notes)' });
  }

  try {
    let credit = await EnergyCredit.findById(creditId);

    if (!credit) {
      return res.status(404).json({ message: 'Energy credit record not found' });
    }

    // Update fields
    if (kwhGenerated !== undefined) credit.kwhGenerated = kwhGenerated;
    if (creditsEarned !== undefined) credit.creditsEarned = creditsEarned;
    if (notes !== undefined) credit.notes = notes;
    // calculationDate is not updated automatically, can be set manually if needed
    // credit.calculationDate = new Date(); // If you want to update the calculation date with every update

    const updatedCredit = await credit.save();
    res.json(updatedCredit);
  } catch (error) {
    console.error('Error updating energy credit:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid creditId format' });
    }
    res.status(500).json({ message: 'Server error while updating energy credit', error: error.message });
  }
});

// @route   DELETE /api/energy-credits/:creditId
// @desc    Delete an energy credit record
// @access  Private (Operations Manager)
router.delete('/:creditId', protect, authorize('operationsManager'), async (req, res) => {
  try {
    const { creditId } = req.params;
    const credit = await EnergyCredit.findById(creditId);

    if (!credit) {
      return res.status(404).json({ message: 'Energy credit record not found' });
    }

    await credit.deleteOne(); // For Mongoose v6+, use deleteOne() or findByIdAndDelete() instead of remove()
    res.json({ message: 'Energy credit record removed successfully' });
  } catch (error) {
    console.error('Error deleting energy credit:', error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid creditId format' });
    }
    res.status(500).json({ message: 'Server error while deleting energy credit', error: error.message });
  }
});

module.exports = router; 