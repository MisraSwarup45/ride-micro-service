const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try{
        const {email, password, name, number} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }

        const newUser = new User({email, password, name, number});
        await newUser.save();
        res.status(201).json({message: 'User created successfully'});

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});

        res.status(200).json({token});


    }catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.getProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.userId);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};