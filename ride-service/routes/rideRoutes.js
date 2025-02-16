const express = require('express');
const { createRide, acceptRide } = require('../controllers/rideControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-ride', authMiddleware.authMiddlewareUser, createRide);
router.put('/accept-ride', authMiddleware.authMiddlewareCaptain, acceptRide);

module.exports = router;