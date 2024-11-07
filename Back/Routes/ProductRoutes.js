const express = require('express');
const router = express.Router();

const {
	addProduct,
	getAllProducts,
	searchProducts,
	filterProducts,
	sortProductsByRating,
	getProduct,
	updateProduct,
	deleteProduct,
	getProductPicture,
	getProductsAdmin
} = require('../Controllers/ProductControllers.js');

// Add product
router.post('/', addProduct);

// Get all products
router.get('/', getAllProducts);

// Get all products for admin
router.get('/admin', getProductsAdmin);

// Get product picture
router.get('/picture/:id', getProductPicture);

// search for products
router.get('/search',searchProducts);

// filter products
router.get('/filter', filterProducts);

//sport products by rating
router.get('/sort', sortProductsByRating);

// Get specific product
router.get('/:id', getProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

module.exports = router;