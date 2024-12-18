const Product = require('../Models/Product');
const UserModel = require("../Models/User");
const CommentModel = require('../Models/Comment');


// Add product
const addProduct = async (req, res) => {
	const {name, description, price, availableQuantity, seller, ratings, reviews} = req.body;

	try {
		let picture= null;
		if (req.file) {
			picture = {
				data: req.file.buffer,
				contentType: req.file.mimetype
			};
		}
		const newProduct = new Product({
			name, description, price, availableQuantity,soldQuantity:0, picture, seller, ratings, reviews
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
		// Find products where quantity is greater than 0
		const products = await Product.find({ availableQuantity: { $gt: 0 } }).populate('seller', '_id username');
		// If no products are found, it's not an error, just no products available
		if (products.length === 0) {
			return res.status(404).json({message: 'No products available'});
		}

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific product
const getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate('seller', '_id username');
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
	const {name, description, price, availableQuantity, seller, ratings, reviews, isArchived} = req.body;
	try {
		const updatedFields = {
			name,
			description,
			price,
			availableQuantity,
			seller,
			ratings,
			reviews,
			isArchived
		};
		// Update image data if a new file is uploaded
		if (req.file) {
			updatedFields.picture = {
				data: req.file.buffer,
				contentType: req.file.mimetype
			};
		}
		const product = await Product.findByIdAndUpdate(req.params.id, updatedFields, {new: true});
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
		const updatedProducts = await Product.find().populate('seller', '_id firstName lastName').select('-picture');
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

// Get comments of a specific product
const getComments = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const comments = await CommentModel.find({ _id: { $in: product.reviews } }).populate('user', 'username');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a comment for a specific product
const addComment = async (req, res) => {
    const { user, text, stars } = req.body;

    try {
        const user2 = await UserModel.findById(user);
        if (!user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        //Check if the user has purchased the product before commenting
          if (!user2.productPurchases.includes(req.params.id)) {
            return res.status(400).json({ message: 'User must purchase the product before commenting' });
        }
	    const totalRating = (product.reviews.length * product.ratings) + stars;
	    const newRating = (totalRating / (product.reviews.length+1)).toFixed(1);
		const newComment = new CommentModel({ user, text, stars, date: new Date()});
		await newComment.save();
		console.log(stars);

		// Update product's reviews and ratings
		const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $push: { reviews: newComment._id }, $set: { ratings: newRating } }, { new: true }).populate('reviews', 'ratings');

        res.status(201).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
	getProductPicture,
	getComments,
	addComment
};

