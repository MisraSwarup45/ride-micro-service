const dotenv = require('dotenv');
dotenv.config();
const Ride = require('../models/Ride');
const axios = require('axios');

exports.createRide = async (req, res) => {
    console.log('Creating ride');
    try{
        const {from, to} = req.body;
        const riderId = req.user;
        
        const newRide = new Ride({
            riderId: riderId,
            from,
            to
        });

        
        const response = await axios.post(`${process.env.RABBITMQ_URI}/api/rabbitmq/publish`, {
            queue: 'new-ride',
            message: JSON.stringify(newRide)
        });
        console.log(response.data);
        await newRide.save();
        res.status(201).json(newRide);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.acceptRide = async (req, res) => {
    try{
        const {rideId} = req.query;
        const captainId = req.user;
        const ride = await Ride.findById(rideId);
        if(!ride){
            return res.status(404).json({message: 'Ride not found'});
        }
        if(ride.status !== 'REQUESTED'){
            return res.status(400).json({message: 'Ride already accepted'});
        }
        ride.captainId = captainId;
        ride.status = 'ACCEPTED';
        await ride.save();

        const response = await axios.post(`${process.env.RABBITMQ_URI}/api/rabbitmq/publish`, {
            queue: 'ride-accepted',
            message: JSON.stringify(ride)
        });
        console.log(response.data);
        res.status(200).json(ride);
    }catch(error){
        res.status(500).json({message: error.message});
    }
    
};