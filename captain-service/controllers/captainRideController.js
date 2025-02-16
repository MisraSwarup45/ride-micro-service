const { subscribeToQueue } = require('../service/rabbit');

let pendingRequests = [];


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