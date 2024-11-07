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
	getAllCreatedActivities,
	getActivitiesAdmin

} = require('../Controllers/ActivityControllers.js');
const upload = require('../Middleware/upload');

const router = express.Router();

// Add an activity
router.post('/', upload.single('image'), addActivity);

// Get all activities
router.get('/', getAllActivities);

// Get all activities for admin
router.get('/admin', getActivitiesAdmin);

// Get upcoming activities
router.get('/upcoming', getUpcomingActivities);

// Search for an activity by category or tag
router.get('/search', SearchForActivity);

// Filter upcoming activities by budget , date , category , rating
router.get('/filter', filterUpcomingActivities);

// Sort activities by price or rating
router.get('/sort', sortActivities);

// Get specific activity
router.get('/:id', getActivity);

// Update an activity
router.put('/:id', upload.single('image'), updateActivity);

// Delete an activity
router.delete('/:id', deleteActivity);

// Get all created activities
router.get('/user/:id', getAllCreatedActivities);

module.exports = router;
