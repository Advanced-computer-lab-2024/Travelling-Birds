const express = require('express');
const {
    createItinerary,
    updateItinerary,
    displayItinerary,
    searchForItinerary,
    getUpcomingItineraries,
    sortItineraries,
    filterItineraries
} = require('../controllers/ItineraryControllers.js');

const router = express.Router();

// Create a new itinerary
router.post('/', createItinerary);

// Update an existing itinerary
router.put('/:id', updateItinerary);

// Display an existing itinerary
router.get('/:id', displayItinerary);

// search for a specific itinerary by it's name or category or tag
router.get('/search', searchForItinerary);


// get all upcoming itineraries
router.get('/', getUpcomingItineraries);

// Sort upcoming itineraries by price or ratings
router.get('/sort', sortItineraries);

// Filter itineraries by budget, date, category, and ratings
router.get('/filter', filterItineraries);

module.exports = router;