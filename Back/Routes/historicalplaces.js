const express = require('express');
const {
    getAllHistoricalPlaces,
    getHistoricalPlace,
    filterHistoricalPlaces
} = require('../controllers/HistoricalPlaceControllers');

const router = express.Router();


// get all upcoming historical places
router.get('/', getAllHistoricalPlaces);

// get a single historical place with name or category or tag
router.get('/search', getHistoricalPlace);

// Filter historical places by tag
router.get('/filter', filterHistoricalPlaces);

module.exports = router;