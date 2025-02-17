const express = require('express');
const router = express.Router();

const { publishMessage, subscribeMessage, subscribeToRideRequests } = require('../controllers/rabbitmqController');

router.post('/publish', publishMessage);
router.post('/subscribe', subscribeMessage);
router.post('/subscribeToRide', subscribeToRideRequests);

module.exports = router;