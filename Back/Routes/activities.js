const express = require('express');
const {
    getUpcomingActivities,
    getActivity

} = require('../controllers/ActivityControllers.js');

const router = express.Router();

// get all upcoming activities
router.get('/', getUpcomingActivities);

// get a single activity with name or category or tag
router.get('/search', getActivity);


module.exports = router;
