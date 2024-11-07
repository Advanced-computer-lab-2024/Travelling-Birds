const express = require('express');
const router = express.Router();
const { searchHotels, bookHotel } = require('../controllers/HotelControllers');

router.post('/search', searchHotels);
router.post('/book', bookHotel);

module.exports = router;
