const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    captainId: {
        type: mongoose.Schema.Types.ObjectId
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['REQUESTED', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'],
        default: 'REQUESTED'
    },
    fare: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

module.exports = mongoose.model('Ride', rideSchema);