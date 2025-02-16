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

exports.processRideRequest = async (req, res) => {
    try {
        const { data } = req.body; 
        const ride = JSON.parse(data);

        pendingRequests.forEach((pendingRes) => {
            pendingRes.status(200).json(ride);
        });

        pendingRequests = [];

        res.status(200).json({ message: "Ride request processed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
