const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductionSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    kilowatt: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Production', ProductionSchema); 