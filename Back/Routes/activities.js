const express = require('express');
const {
    SearchForActivity,
    createActivity,
    updateActivity,
    displayActivity,
    deleteActivity,
    getUpcomingActivities,
    filterUpcomingActivities,
    sortActivities,
    getAllCreatedActivities

} = require('../controllers/ActivityControllers.js');

const router = express.Router();

// search for a specific Activity by it's category or tag
router.get('/search', SearchForActivity);

// Create a new activity
router.post('/postActivity', createActivity);

// Update an existing activity
router.put('/putActivity/:id', updateActivity);

// Display an existing activity
router.get('/displayActivity/:id', displayActivity);

//Delete an existing activity
router.delete('/deleteActivity/:id', deleteActivity);

// get all upcoming activities
router.get('/', getUpcomingActivities);

// Filter all upcoming activities by budget, date, category, and ratings
router.get('/filter', filterUpcomingActivities);

// Sort upcoming activities by price or ratings
router.get('/sort', sortActivities);

// Get all created activities by a specific user
router.get('/user/:id', getAllCreatedActivities);


module.exports = router;
