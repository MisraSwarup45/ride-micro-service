const dotenv = require('dotenv');
dotenv.config();
const Ride = require('../models/Ride');
const axios = require('axios');

const haversineDistance = async (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRadians = (deg) => (deg * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
};

const calculateFare = async (fromLat, fromLng, toLat, toLng) => {
    const distance = await  haversineDistance(fromLat, fromLng, toLat, toLng);
    
    const baseFare = 50;
    const perKmRate = 10; 
    const baseDistance = 3;

    let fare = baseFare;
    
    if (distance > baseDistance) {
        fare += (distance - baseDistance) * perKmRate;
    }

    return Math.round(fare);
};

exports.createRide = async (req, res) => {
    try{
        const {from, to, fromLat, fromLng, toLat, toLng} = req.body;
        const riderId = req.user;

        const fare = await calculateFare(fromLat, fromLng, toLat, toLng);

        const captainsList = await axios.post(`${process.env.LOCATION_SERVICE}/api/locations/nearby`, {
            latitude: fromLat,
            longitude: fromLng,
            radius: 10
        });

        if(captainsList.data.captains.length === 0){
            return res.status(400).json({message: 'No captains available'});
        }

        console.log(captainsList.data.captains);
        
        
        const newRide = new Ride({
            riderId: riderId,
            from,
            to,
            fare
        });


        await newRide.save();

        for(const captainId of captainsList.data.captains){
            const rideRequest = {
                rideId: newRide._id,
                riderId: riderId,
                from,
                to,
                fare
            }

            await axios.post(`${process.env.RABBITMQ_URI}/api/rabbitmq/publish`, {
                queue: `ride-request-${captainId}`,
                message: JSON.stringify(rideRequest)
            });

            console.log(`Ride request sent to captain ${captainId}`);
        }

        res.status(201).json({ message: 'Ride request sent to captains', ride: newRide });
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.acceptRide = async (req, res) => {
    try {
        const { rideId } = req.query;
        const captainId = req.user._id;
        

        const ride = await Ride.findOneAndUpdate(
            { _id: rideId, status: 'REQUESTED' },
            { captainId, status: 'ACCEPTED' },
            { new: true }
        );

        if (!ride) {
            return res.status(400).json({ message: 'Ride already accepted by another captain' });
        }

        await ride.save()

        await axios.post(`${process.env.LOCATION_SERVICE}/api/locations/remove-captain`, {
            captainId
        });

        res.status(200).json({ message: 'Ride accepted successfully', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};