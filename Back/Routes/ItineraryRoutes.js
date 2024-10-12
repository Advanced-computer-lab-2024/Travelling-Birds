const express = require('express');
const {
	addItinerary,
	getAllItineraries,
	getItinerary,
	updateItinerary,
	deleteItinerary,
	SearchForItinerary,
	getUpcomingItineraries,
	sortItineraries,
	filterItineraries,
	getAllCreatedItineraries
} = require('../Controllers/ItineraryControllers.js');

const router = express.Router();

// Add itinerary
router.post('/', addItinerary);

// Get all itineraries
router.get('/', getAllItineraries);

// Search for itineraries by category or tag
router.get('/search', SearchForItinerary);

// Get upcoming itineraries
router.get('/upcoming', getUpcomingItineraries);

// Sort itineraries by price or rating
router.get('/sort', sortItineraries);

// Filter itineraries by budget or date or preferences or language
router.get('/filter', filterItineraries);

// Get specific itinerary
router.get('/:id', getItinerary);

// Update itinerary
router.put('/:id', updateItinerary);

// Delete itinerary
router.delete('/:id', deleteItinerary);


// Get all created itineraries by a specific user
router.get('/user/:id', getAllCreatedItineraries);


module.exports = router;