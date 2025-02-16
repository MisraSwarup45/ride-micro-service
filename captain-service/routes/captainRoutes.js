const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, updateAvailability, deteleProfile} = require('../controllers/authController');
const { waitForRideRequest } = require('../controllers/captainRideController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/availability', authMiddleware, updateAvailability);
router.delete('/profile', authMiddleware, deteleProfile);
router.post('/wait-for-ride', authMiddleware, waitForRideRequest);

module.exports = router;