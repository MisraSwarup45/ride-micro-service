const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, updateAvailability, deteleProfile, waitForRideRequest} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/availability', authMiddleware, updateAvailability);
router.delete('/profile', authMiddleware, deteleProfile);
router.post('/wait-for-ride', authMiddleware, waitForRideRequest);

module.exports = router;