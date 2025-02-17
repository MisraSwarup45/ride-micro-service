const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

exports.waitForRideRequest = async (req, res) => {
    const captainId = req.user.id;
    console.log(captainId);
    if (!captainId) {
        return res.status(400).json({ message: 'Captain ID is required' });
    }

    try {
        const timeout = 30000;

        const response = await Promise.race([
            axios.post(`${process.env.RABBITMQ_URI}/api/rabbitmq/subscribeToRide`, {
                captainId: captainId,
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out after 30 seconds')), timeout)
            ),
        ]);

        console.log('Ride request received:', response.data);
        
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error during polling:', error.message);
        return res.status(500).json({ message: error.message });
    }
};