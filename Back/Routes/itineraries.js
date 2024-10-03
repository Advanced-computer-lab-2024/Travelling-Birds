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
} = require('../controllers/ItineraryControllers.js');

const router = express.Router();

// Add itinerary
router.post('/', addItinerary);

// Get all itineraries
router.get('/', getAllItineraries);

// Get specific itinerary
router.get('/:id', getItinerary);

// Update itinerary
router.put('/:id', updateItinerary);

// Delete itinerary
router.delete('/:id', deleteItinerary);

// Search for itineraries
router.get('/search', SearchForItinerary);

// Get upcoming itineraries
router.get('/upcoming', getUpcomingItineraries);

// Sort itineraries
router.get('/sort', sortItineraries);

// Filter itineraries
router.get('/filter', filterItineraries);

// Get all created itineraries by a specific user
router.get('/user/:id', getAllCreatedItineraries);


module.exports = router;