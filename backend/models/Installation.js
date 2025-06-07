const mongoose = require('mongoose');

const InstallationSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    technicalData: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Validated'],
        default: 'Pending',
    },
    certificate: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Installation', InstallationSchema); 