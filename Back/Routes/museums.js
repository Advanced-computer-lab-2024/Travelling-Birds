const express = require('express');
const router = express.Router();

const {
	addMuseum,
	getMuseums,
	updateMuseum,
	deleteMuseum,
	SearchForMuseums,
	filterMuseums,
	getAllCreatedMuseums
} = require('../controllers/MuseumControllers.js');

// Add a new Museum
router.post('/', addMuseum);

// Get all Museums
router.get('/', getMuseums);

// Update a Museum
router.put('/:id', updateMuseum);

// Delete a Museum
router.delete('/:id', deleteMuseum);

// search for a specific Museum by it's name or tag
router.get('/search', SearchForMuseums);


// Filter museums by tag
router.get('/filter', filterMuseums);

// Get all created museums
router.get('/user/:id', getAllCreatedMuseums);

module.exports = router;
