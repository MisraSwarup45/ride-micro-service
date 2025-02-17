const redis = require('../config/redis');

exports.updateLocation = async (req, res) => {
    try {
        const { captainId, latitude, longitude } = req.body;
        if (!captainId || !latitude || !longitude) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await redis.geoadd('captains', longitude, latitude, captainId);
        res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findNearbyCaptains = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.body;
        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const captains = await redis.georadius('captains', longitude, latitude, radius, 'km');
        res.status(200).json({ captains });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeCaptain = async (req, res) =>{
    try {
        const { captainId } = req.body;

        if (!captainId) {
            return res.status(400).json({ message: 'Captain ID is required' });
        }

        const result = await redis.zrem('captains', captainId);

        if (result === 0) {
            return res.status(404).json({ message: 'Captain not found in Redis' });
        }

        res.status(200).json({ message: 'Captain removed from Redis successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}