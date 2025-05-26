const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  certificateFile: {
    type: String, // Path to the uploaded PDF file
    required: true
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Technician who issued the certificate
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', CertificateSchema); 