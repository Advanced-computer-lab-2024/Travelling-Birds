const express = require('express');
const {
    getUpcomingActivities,
    getActivity,
    filterActivities,
    sortActivities

} = require('../controllers/ActivityControllers.js');

const router = express.Router();

// get all upcoming activities
router.get('/', getUpcomingActivities);

// get a single activity with name or category or tag
router.get('/search', getActivity);

// Filter activities by budget, date, category, and ratings
router.get('/filter', filterActivities);

// Sort upcoming activities by price or ratings
router.get('/sort', sortActivities); 


module.exports = router;