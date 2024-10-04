const express = require('express');
const router = express.Router();

const {
	addProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct
} = require('../controllers/ProductControllers.js');

// Add product
router.post('/', addProduct);

// Get all products
router.get('/', getAllProducts);

// Get specific product
router.get('/:id', getProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

module.exports = router;