const express = require('express');

const router = express.Router();

const { updateLocation, findNearbyCaptains, removeCaptain } = require('../controllers/locationControllers');

router.post('/update', updateLocation);
router.post('/nearby', findNearbyCaptains);
router.post('/remove-captain', removeCaptain);

module.exports = router;