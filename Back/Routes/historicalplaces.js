const express = require('express');
const {
    SearchForHistoricalPlace,
    getUpcomingHistoricalPlaces,
    filterHistoricalPlaces
} = require('../controllers/HistoricalPlaceControllers');

const router = express.Router();

// search for a specific HistoricalPlace by it's name or category or tag
router.get('/search', SearchForHistoricalPlace);

// get all upcoming historical places
router.get('/', getUpcomingHistoricalPlaces);

// Filter historical places by tag
router.get('/filter', filterHistoricalPlaces);

module.exports = router;