const express = require('express');
const {
	addHistoricalPlace,
	getAllHistoricalPlaces,
	getHistoricalPlace,
	updateHistoricalPlace,
	deleteHistoricalPlace,
	SearchForHistoricalPlace,
	filterHistoricalPlaces,
	getAllCreatedHistoricalPlaces
} = require('../controllers/HistoricalPlaceControllers');

const router = express.Router();

// Add historical place
router.post('/', addHistoricalPlace);

// Get all historical places
router.get('/', getAllHistoricalPlaces);

// Search for historical places by name or tag
router.get('/search', SearchForHistoricalPlace);

// Filter historical places by tag
router.get('/filter', filterHistoricalPlaces);

// Get specific historical place
router.get('/:id', getHistoricalPlace);

// Update historical place
router.put('/:id', updateHistoricalPlace);

// Delete historical place
router.delete('/:id', deleteHistoricalPlace);

// Get all created historical places by a specific user
router.get('/user/:id', getAllCreatedHistoricalPlaces);


module.exports = router;