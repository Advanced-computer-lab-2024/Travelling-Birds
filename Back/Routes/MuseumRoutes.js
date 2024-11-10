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
	getAllCreatedMuseums,
	getAllMuseumsBrief,
	getAllMuseumsBriefForUser
} = require('../Controllers/MuseumControllers.js');
const {upload} = require('../Middleware/upload');

// Add museum
router.post('/', upload.single('image'), addMuseum);

// Get all museums
router.get('/', getAllMuseums);

// Get all museums with brief details
router.get('/brief', getAllMuseumsBrief);

// Get all museums with brief details for a specific user
router.get('/brief/:id', getAllMuseumsBriefForUser);

// Search for museums by name or tag
router.get('/search', SearchForMuseums);

// Filter museums by tag
router.get('/filter', filterMuseums);

// Get specific museum
router.get('/:id', getMuseum);

// Update museum
router.put('/:id', upload.single('image'), updateMuseum);

// Delete museum
router.delete('/:id', deleteMuseum);

// Get all created museums by a specific user
router.get('/user/:id', getAllCreatedMuseums);

module.exports = router;
