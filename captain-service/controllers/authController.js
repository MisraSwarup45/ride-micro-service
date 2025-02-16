const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Captain = require('../models/Captain');

const axios = require('axios');

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

        if(captain.availability) {
            const response = await axios.post(`${process.env.LOCATION_SERVICE}/api/locations/update`, {
                captainId: req.user.id,
                latitude: 28.7041,
                longitude: 77.1025
            })

            if(response.status !== 200) {
                return res.status(500).json({ message: 'Failed to update location' });
            }

            console.log('Location updated successfully');
        }

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