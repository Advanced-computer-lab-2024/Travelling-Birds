const express = require('express');
const router = express.Router();

const {
    SearchForMuseums,
    getUpcomingMuseums,
    filterMuseums
} = require('../controllers/MuseumControllers.js');


// search for a specific Museum by it's name or category or tag
router.get('/search', SearchForMuseums);

// get all upcoming museums
router.get('/', getUpcomingMuseums);

// Filter museums by tag
router.get('/filter', filterMuseums);

module.exports = router;
