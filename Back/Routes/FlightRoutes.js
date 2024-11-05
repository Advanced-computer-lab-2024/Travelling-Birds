const express = require('express');
const router = express.Router();
const flightController = require('../Controllers/FlightControllers');

router.post('/search', flightController.searchFlights);

module.exports = router;