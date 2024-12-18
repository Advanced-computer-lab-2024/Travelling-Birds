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
	getAllCreatedItineraries,
	getComments,
	addComment,
	getActivities,
	getItineraryBrief,
	getItineraryBriefForUser,
	getTouristReport
} = require('../Controllers/ItineraryControllers.js');

const router = express.Router();
const {upload} = require('../Middleware/upload');

// Add itinerary
router.post('/', upload.single('image'), addItinerary);

// Get all itineraries
router.get('/', getAllItineraries);

// Get all itineraries brief
router.get('/brief', getItineraryBrief);

// Get all itineraries brief for a specific user
router.get('/brief/:id', getItineraryBriefForUser);

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
router.put('/:id', upload.single('image'), updateItinerary);

// Delete itinerary
router.delete('/:id', deleteItinerary);

// Get all created itineraries by a specific user
router.get('/user/:id', getAllCreatedItineraries);

// Get all comments for a specific itinerary
router.get('/:id/comments', getComments);

// Add a comment to a specific itinerary
router.post('/:id/comments', addComment);

// Get all activities for a specific itinerary
router.get('/:id/activities', getActivities);

router.get('/:id/report', getTouristReport)

module.exports = router;