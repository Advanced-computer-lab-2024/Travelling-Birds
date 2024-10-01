const express = require('express');
const router = express.Router();

const {addTag, getTags, updateTag, deleteTag} = require('../controllers/TagController.js');

// Add a new tag
router.post('/', addTag);

// Get all tags
router.get('/', getTags);

// Update a tag
router.put('/:id', updateTag);

// Delete a tag
router.delete('/:id', deleteTag);

module.exports = router;