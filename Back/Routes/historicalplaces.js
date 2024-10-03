const express = require('express');
const {
    addHistoricalPlace,
    getAllHistoricalPlaces,
    updateHistoricalPlace,
    deleteHistoricalPlace,
    SearchForHistoricalPlace,
    filterHistoricalPlaces,
    getAllCreatedHistoricalPlaces
} = require('../controllers/HistoricalPlaceControllers');

const router = express.Router();

// Add a new HistoricalPlace
router.post('/', addHistoricalPlace);

// Get all HistoricalPlace
router.get('/', getAllHistoricalPlaces);

// Update a HistoricalPlace
router.put('/:id', updateHistoricalPlace);

// Delete a HistoricalPlace
router.delete('/:id', deleteHistoricalPlace);

// search for a specific HistoricalPlace by it's name or tag
router.get('/search', SearchForHistoricalPlace);

// Filter Historical Places 
router.get('/filter', filterHistoricalPlaces);



// Get all created historical places
router.get('/user/:id', getAllCreatedHistoricalPlaces);

module.exports = router;