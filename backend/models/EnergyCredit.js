const mongoose = require('mongoose');

const EnergyCreditSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  kwhGenerated: {
    type: Number,
    required: true,
  },
  creditsEarned: {
    type: Number,
    required: true,
  },
  calculationDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true }); // createdAt ve updatedAt alanlarını otomatik ekler

module.exports = mongoose.model('EnergyCredit', EnergyCreditSchema); 