const express = require('express');
const {
    addActivity,
	getAllActivities,
	getActivity,
	updateActivity,
	deleteActivity,
	SearchForActivity,
	getUpcomingActivities,
	filterUpcomingActivities,
	sortActivities,
	getAllCreatedActivities

} = require('../controllers/ActivityControllers.js');

const router = express.Router();

// Add an activity
router.post('/', addActivity);

// Get all activities
router.get('/', getAllActivities);

// Get specific activity
router.get('/:id', getActivity);

// Update an activity
router.put('/:id', updateActivity);

// Delete an activity
router.delete('/:id', deleteActivity);

// Search for an activity
router.get('/search', SearchForActivity);

// Get upcoming activities
router.get('/upcoming', getUpcomingActivities);

// Filter upcoming activities
router.get('/filter', filterUpcomingActivities);

// Sort activities
router.get('/sort', sortActivities);

// Get all created activities
router.get('/user/:id', getAllCreatedActivities);

module.exports = router;
