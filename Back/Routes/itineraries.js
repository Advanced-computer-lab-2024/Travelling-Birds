const express = require('express');
const {
    createItinerary,
    updateItinerary,
    displayItinerary,
    getUpcomingItineraries,
    getItinerary,
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

// get all upcoming itineraries
router.get('/', getUpcomingItineraries);

// get a single itinerary with name or category or tag
router.get('/search', getItinerary);

// Sort upcoming itineraries by price or ratings
router.get('/sort', sortItineraries);

// Filter itineraries by budget, date, category, and ratings
router.get('/filter', filterItineraries);

module.exports = router;