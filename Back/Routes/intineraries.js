const express = require('express');
const {
    createIntinerary,
    updateIntinerary,
    displayIntinerary,
    SearchForIntinerary,
    getUpcomingIntineraries,
    sortIntineraries,
    filterIntineraries
} = require('../controllers/IntineraryControllers.js');

const router = express.Router();

// Create a new intinerary
router.post('/', createIntinerary);

// Update an existing intinerary
router.put('/:id', updateIntinerary);

// Display an existing intinerary
router.get('/:id', displayIntinerary);

// search for a specific Intinerary by it's name or category or tag
router.get('/search', SearchForIntinerary );


// get all upcoming intineraries
router.get('/', getUpcomingIntineraries);


// Sort upcoming intineraries by price or ratings
router.get('/sort', sortIntineraries);

// Filter intineraries by budget, date, category, and ratings
router.get('/filter', filterIntineraries);

module.exports = router;