const express = require('express');
const router = express.Router();
const {searchFlights, getFlightDetails, bookFlight} = require('../Controllers/FlightControllers');

router.post('/f', searchFlights);
router.get('/:flightId/:origin/:destination/:departureDate/:currencyCode', getFlightDetails);
router.post('/book', bookFlight);

module.exports = router;