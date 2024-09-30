const express = require('express');
const {
    SearchForActivity,
    getUpcomingActivities,
    filterUpcomingActivities,
    sortActivities

} = require('../controllers/ActivityControllers.js');

const router = express.Router();

// search for a specific Activity by it's name or category or tag
router.get('/search', SearchForActivity);

// get all upcoming activities
router.get('/', getUpcomingActivities);

// Filter all upcoming activities by budget, date, category, and ratings
router.get('/filter', filterUpcomingActivities);

// Sort upcoming activities by price or ratings
router.get('/sort', sortActivities); 


module.exports = router;
