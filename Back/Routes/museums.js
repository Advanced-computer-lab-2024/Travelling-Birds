const express = require('express');
const router = express.Router();

const {
	addMuseum,
	getAllMuseums,
	getMuseum,
	updateMuseum,
	deleteMuseum,
	SearchForMuseums,
	filterMuseums,
	getAllCreatedMuseums
} = require('../controllers/MuseumControllers.js');

// Add museum
router.post('/', addMuseum);

// Get all museums
router.get('/', getAllMuseums);

// Get specific museum
router.get('/:id', getMuseum);

// Update museum
router.put('/:id', updateMuseum);

// Delete museum
router.delete('/:id', deleteMuseum);

// Search for museums
router.get('/search', SearchForMuseums);

// Filter museums
router.get('/filter', filterMuseums);

// Get all created museums by a specific user
router.get('/user/:id', getAllCreatedMuseums);

module.exports = router;
