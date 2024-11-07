const Product = require('../Models/Product');
const UserModel = require("../Models/User");

// Add product
const addProduct = async (req, res) => {
	const {name, description, price, availableQuantity, picture, seller, ratings, reviews} = req.body;
	try {
		const newProduct = new Product({
			name, description, price, availableQuantity, picture, seller, ratings, reviews
		});
		await newProduct.save();
		const user = await UserModel.findById(newProduct.seller).select('firstName lastName');
		newProduct._doc.sellerName = user ? `${user.firstName} ${user.lastName}` : 'N/A';
		res.status(201).json(newProduct);
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
		if (!product)
			return res.status(404).json({message: 'Product not found'});

		res.status(200).json(product);
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
// Search Product
const searchProducts = async (req, res) => {
	const {name} = req.query;
	try {
		const products = await Product.find({name: {$regex: new RegExp(name, 'i')}});

		if (!products) {
			return res.status(404).json({message: "No Products Found With This Name"});

		}
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Filter Product
const filterProducts = async (req, res) => {
	const {maxPrice} = req.query;
	const filterByMax = {};
	if (maxPrice) {
		filterByMax.price = {$lte: parseFloat(maxPrice)};
	}

	try {
		const products = await Product.find(filterByMax);
		if (!products) {
			return res.status(404).json({message: "No Products Found Within This Specified Price"});

		}
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Sort Product
const sortProductsByRating = async (req, res) => {
	const {productsOrder} = req.query
	;
	const sortOrder = (productsOrder && productsOrder.trim().toLowerCase() === 'asc') ? 1 : -1;
	try {
		const products = await Product.aggregate([
			// Step 1: Calculate the average rating for each product
			{
				$addFields: {
					avgRating: {$avg: "$ratings"}
				}
			},
			// Step 2: Sort the products by the calculated average rating
			{
				$sort: {avgRating: sortOrder}
			}
		]);
		if (!products) {
			return res.status(404).json({message: "Product Not Found"});
		}

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({error: error.message});
	}

}

const getProductsAdmin = async (req, res) => {
	try {
		const Products = await Product.find();
		const updatedProducts = await Promise.all(Products.map(async (product) => {
			const user = await UserModel.findById(product.seller).select('firstName lastName');
			product._doc.sellerName = user ? `${user.firstName} ${user.lastName}` : 'N/A';
			return product;
		}));
		res.status(200).json(updatedProducts);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getProductPicture = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).select('picture');
		if (!product) {
			return res.status(404).json({message: 'Product not found'});
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

module.exports = {
	addProduct,
	getAllProducts,
	getProduct,
	updateProduct,
	deleteProduct,
	sortProductsByRating,
	filterProducts,
	searchProducts,
	getProductsAdmin,
	getProductPicture
};

