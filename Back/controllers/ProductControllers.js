const Product = require('../Models/Product');

// Add product
const addProduct = async (req, res) => {
	const {name, description, price, availableQuantity, picture, seller, ratings, reviews} = req.body;
	try {
		const newProduct = new Product({
			name, description, price, availableQuantity, picture, seller, ratings, reviews
		});
		await newProduct.save();
		res.status(201).json({message: 'Product added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get products
const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific product
const getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({message: 'Product not found'});
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update product
const updateProduct = async (req, res) => {
	const {name, description, price, availableQuantity, picture, seller, ratings, reviews} = req.body;
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, {
			name, description, price, availableQuantity, picture, seller, ratings, reviews
		}, {new: true});
		if (!product) {
			return res.status(404).json({message: 'Product not found'});
		}
		res.status(200).json({message: 'Product updated successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Delete product
const deleteProduct = async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);
		res.status(200).json({message: 'Product deleted successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct
};

