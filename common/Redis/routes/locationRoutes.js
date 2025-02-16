const express = require('express');

const router = express.Router();

const { updateLocation, findNearbyCaptains } = require('../controllers/locationControllers');

router.post('/update', updateLocation);
router.post('/nearby', findNearbyCaptains);

module.exports = router;