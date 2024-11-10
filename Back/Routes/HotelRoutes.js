const express = require('express');
const router = express.Router();
const { searchHotels, getHotelDetails, bookHotel } = require('../controllers/HotelControllers');

router.post('/search', searchHotels);
router.get('/:hotelId/:checkInDate/:checkOutDate/:currencyCode', getHotelDetails);
router.post('/book', bookHotel);

module.exports = router;
