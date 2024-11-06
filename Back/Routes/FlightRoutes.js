const express = require('express');
const router = express.Router();
const {searchFlights} = require('../Controllers/FlightControllers');

router.get('/f', searchFlights);

module.exports = router;