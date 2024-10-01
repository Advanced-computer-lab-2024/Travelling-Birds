const Product = require('../Models/Product');


// Adding product as admin or seller
const addProduct = async (req, res) => {
	//no reference to logged-in seller
	const {name, description, price, availableQuantity, picture} = req.body;
	try {
		const newProduct = new Product(
			{name,
				description,
				price,
				availableQuantity,
				picture,
				seller: 'seller',
				review: 0
			});
		await newProduct.save();
		res.status(201).json({message: 'Product added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Editing product as admin or seller
const updateProduct = async (req, res) => {
	const {name, description, price, availableQuantity, picture} = req.body;
	const tempProduct = await Product.find({name});
	if (!tempProduct) {
		res.status(500).json({msg: "No product found with this name"});
	}
	else {
		try {
			const updatedProduct = Product.findOneAndUpdate(
				{name},
				{description, price, availableQuantity, picture},
				{new: true});
			await updatedProduct.save();
			res.status(201).json({msg: "Product updated successfully"});
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	}
}

module.exports = {addProduct, updateProduct};

