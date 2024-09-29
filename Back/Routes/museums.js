const express = require('express');
const {
    getUpcomingMuseums,
    getMuseums,
    filterMuseums
} = require('../controllers/MuseumControllers.js');

const router = express.Router();

// get all upcoming museums
router.get('/', getUpcomingMuseums);

// get a single museum with name or category or tag
router.get('/search', getMuseums);

// Filter museums by tag
router.get('/filter', filterMuseums);

module.exports = router;
