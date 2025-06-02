const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required.'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required.'],
    trim: true,
  },
  panelModel: {
    type: String,
    trim: true,
  },
  panelCount: {
    type: Number,
  },
  installationDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Installation', installationSchema); 