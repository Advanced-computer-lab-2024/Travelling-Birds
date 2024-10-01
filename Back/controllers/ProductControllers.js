const Product = require('../Models/Product');


// Adding product as admin or seller
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

// Editing product as admin or seller
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

module.exports = {addProduct, updateProduct};

