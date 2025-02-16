const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CaptainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
    },
    rides :{
        type: Array,
        default: []
    },
    availability: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

CaptainSchema.pre('save', async function(next) {
    const captain = this;
    if (captain.isModified('password')) {
        captain.password = await bcrypt.hash(captain.password, 10);
    }
    next();
});

module.exports = mongoose.model('Captain', CaptainSchema);