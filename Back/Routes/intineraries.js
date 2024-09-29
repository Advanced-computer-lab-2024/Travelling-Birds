const express = require('express');
const {
    getUpcomingIntineraries,
    getIntinerary,
    sortIntineraries,
    filterIntineraries
} = require('../controllers/IntineraryControllers.js');

const router = express.Router();

// get all upcoming intineraries
router.get('/', getUpcomingIntineraries);

// get a single intinerary with name or category or tag
router.get('/search', getIntinerary);

// Sort upcoming intineraries by price or ratings
router.get('/sort', sortIntineraries);

// Filter intineraries by budget, date, category, and ratings
router.get('/filter', filterIntineraries);

module.exports = router;