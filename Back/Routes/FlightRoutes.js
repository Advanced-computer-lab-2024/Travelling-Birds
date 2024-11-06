const express = require('express');
const router = express.Router();
const {searchFlights, getFlightDetails} = require('../Controllers/FlightControllers');

router.post('/f', searchFlights);
router.get('/:flightId', getFlightDetails);

module.exports = router;