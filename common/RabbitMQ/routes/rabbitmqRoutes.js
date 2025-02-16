const express = require('express');
const router = express.Router();

const { publishMessage, subscribeMessage } = require('../controllers/rabbitmqController');

router.post('/publish', publishMessage);
router.post('/subscribe', subscribeMessage);

module.exports = router;