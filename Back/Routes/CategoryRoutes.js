const express = require('express');
const {
    addCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../Controllers/CategoryControllers.js');

const router = express.Router();

// Add a category
router.post('/', addCategory);

// Get all categories
router.get('/', getAllCategories);

// Get specific category
router.get('/:id', getCategory);

// Update a category
router.put('/:id', updateCategory);

// Delete a category
router.delete('/:id', deleteCategory);

module.exports = router;