const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Captain = require('../models/Captain');
const { subscribeToQueue } = require('../service/rabbit');

let pendingRequests = [];

exports.register = async (req, res) => {
    try {
        const { email, password, name, number } = req.body;
        const captain = await Captain.findOne({ email });
        if (captain) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        const newCaptain = new Captain({ email, password, name, number });
        await newCaptain.save();
        res.status(201).json({ message: 'Captain created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const captain = await Captain.findOne({ email });

        if (!captain) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const captain = await Captain.findById(req.user.id).select('-password');
        res.status(200).json(captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const captain = await Captain.findById(req.user.id);

        captain.name = name;
        captain.email = email;

        await captain.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateAvailability = async (req, res) => {
    try {
        const captain = await Captain.findById(req.user.id);
        captain.availability = !captain.availability;

        await captain.save();
        res.status(200).json({ message: 'Availability updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deteleProfile = async (req, res) => {
    try {
        await Captain.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Captain deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.waitForRideRequest = async (req, res) => {
    try {
        req.setTimeout(30000, () => {
            res.status(200).json({ message: 'No ride requests' });
        });

        pendingRequests.push(res);

        req.on('close', () => {
            pendingRequests = pendingRequests.filter(pendingRes => pendingRes !== res);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

subscribeToQueue('new-ride', async (data) => {
    const ride = JSON.parse(data);
    pendingRequests.forEach((res) => {
        res.status(200).json(ride);
    });
    pendingRequests = [];
});