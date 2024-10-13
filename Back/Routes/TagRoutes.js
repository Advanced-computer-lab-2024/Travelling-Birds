const express = require('express');
const router = express.Router();

const {
	addTag,
	getAllTags,
	getTag,
	updateTag,
	deleteTag
} = require('../Controllers/TagController.js');

// Add tag
router.post('/', addTag);

// Get all tags
router.get('/', getAllTags);

// Get specific tag
router.get('/:id', getTag);

// Update tag
router.put('/:id', updateTag);

// Delete tag
router.delete('/:id', deleteTag);

module.exports = router;