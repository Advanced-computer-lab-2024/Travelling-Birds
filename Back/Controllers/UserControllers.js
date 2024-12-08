const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');
const Product = require('../Models/Product');
const defaultProfilePicture = require('../Resources/DefaultProfilePicture');
const Comment = require('../Models/Comment.js');
const UUID = require('uuid').v4;

// Add user
const addUser = async (req, res) => {
	const {
		firstName,
		lastName,
		username,
		email,
		password,
		role,
		mobileNumber,
		nationality,
		dob,
		job,
		yearsOfExperience,
		previousWork,
		website,
		hotline,
		companyProfile,
		wallet,
		isApproved,
		description,
	} = req.body;
	try {
		let backDrop = null;
		let profilePicture;
		// Use the imported base64 string and convert it to a buffer
		const imageBuffer = Buffer.from(defaultProfilePicture, 'base64');
		profilePicture = {
			data: imageBuffer,
			contentType: 'image/webp'
		};
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			firstName,
			lastName,
			username,
			email,
			password: hashedPassword,
			role,
			mobileNumber,
			nationality,
			dob,
			job,
			yearsOfExperience,
			previousWork,
			website,
			hotline,
			companyProfile,
			wallet,
			isApproved,
			description,
			profilePicture,
			backDrop,
			termsFlag: false,
			loyaltyPoints: 0,
			redeemablePoints: 0,
			requestToDelete: false
		});

		// Handle identity card upload if provided
		if (req.files?.identityCard) {
			newUser.identityCard = {
				name: req.files.identityCard[0].originalname,
				file: {
					data: req.files.identityCard[0].buffer,
					contentType: req.files.identityCard[0].mimetype,
				},
			};
		}

		// Handle certificates upload if provided
		if (req.files?.certificates) {
			newUser.certificates = req.files.certificates.map((file) => ({
				name: file.originalname,
				file: {
					data: file.buffer,
					contentType: file.mimetype,
				},
			}));
		}

		// Handle tax registration card upload if provided
		if (req.files?.taxRegCard) {
			newUser.taxRegCard = {
				name: req.files.taxRegCard[0].originalname,
				file: {
					data: req.files.taxRegCard[0].buffer,
					contentType: req.files.taxRegCard[0].mimetype,
				},
			};
		}

		await newUser.save();
		// res.status(200).json({});
		res.status(201).json({message: 'User added successfully', data: newUser});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get all users
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get specific user
const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate('comments');
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		return res.status(200).json(user);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getUsername = async (req, res) => {
	const {username} = req.query;
	try {
		const user = await User.findOne({username});
		if (!user) {
			return res.status(201).json({message: 'User not found'});
		}
		return res.status(200).json(user);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Update user
const updateUser = async (req, res) => {
	const {
		firstName,
		lastName,
		username,
		email,
		password,
		role,
		mobileNumber,
		nationality,
		dob,
		job,
		yearsOfExperience,
		previousWork,
		website,
		hotline,
		companyProfile,
		wallet,
		isApproved,
		description,
		termsFlag,
		loyaltyPoints,
		redeemablePoints,
		requestToDelete,
		profilePicture, // Added to handle null value
		backDrop // Added to handle null value
	} = req.body;

	try {
		let hashedPassword = password;
		if (req.body.password) {
			hashedPassword = await bcrypt.hash(password, 10);
		}

		const updatedFields = {
			firstName,
			lastName,
			username,
			email,
			password: hashedPassword,
			role,
			mobileNumber,
			nationality,
			dob,
			job,
			yearsOfExperience,
			previousWork,
			website,
			hotline,
			companyProfile,
			wallet,
			isApproved,
			description,
			termsFlag,
			loyaltyPoints,
			redeemablePoints,
			requestToDelete
		};

		// Handle setting profilePicture to null
		if (profilePicture === null || profilePicture === '') {
			updatedFields.profilePicture = null;
		}

		// Handle setting backDrop to null
		if (backDrop === null || backDrop === '') {
			updatedFields.backDrop = null;
		}

		// Update image data if a new file is uploaded
		if (req.files) {
			if (req.files.profilePicture) {
				updatedFields.profilePicture = {
					data: req.files.profilePicture[0].buffer,
					contentType: req.files.profilePicture[0].mimetype
				};
			}
			if (req.files.backDrop) {
				updatedFields.backDrop = {
					data: req.files.backDrop[0].buffer,
					contentType: req.files.backDrop[0].mimetype
				};
			}
		}

		const user = await User.findByIdAndUpdate(req.params.id, updatedFields, {new: true});
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({error: error.message});
		console.log(error);
	}
}

// Delete user
const deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json({message: 'User deleted successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Login
const login = async (req, res) => {
	const {username, password} = req.body;

	try {
		const user = await User.findOne({username});
		if (!user) {
			return res.status(404).json({message: 'User not found. Please check the username.'});
		}
		if (!await bcrypt.compare(password, user.password)) {
			return res.status(401).json({message: 'Invalid password. Please try again.'});
		}
		if (['tour_guide', 'advertiser', 'seller'].includes(user.role) && user.isApproved === false) {
			return res.status(403).json({message: 'Profile not approved yet. Please wait for admin approval.'});
		}
		if (user.otp) {
			user.otp = null;
			user.save();
		}

		res.status(200).json({message: 'Login successful', user});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getUnapprovedUsers = async (req, res) => {
	try {
		const query = [
			{
				$match: {
					role: {'$in': ['tour_guide', 'advertiser', 'seller']},
					isApproved: false
				}
			},
			{
				$group: {
					_id: "$role",
					items: {$push: "$$ROOT"}
				}
			},
			{
				$project: {
					"items.firstName": 1,
					"items.lastName": 1,
					"items.username": 1,
					"items.email": 1,
					"items._id": 1,
					"items.role": 1
				}
			}
		];
		const result = await User.aggregate(query);
		const users = {};
		result.forEach(item => {
			users[item._id + "s"] = item.items;
		});

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getUserDocuments = async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await User.findById(userId).select('identityCard certificates taxRegCard');
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		const documents = {
			identityCard: user.identityCard,
			certificates: user.certificates,
			taxRegCard: user.taxRegCard
		}
		res.status(200).json(documents);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getApprovedUsers = async (req, res) => {
	try {
		const query = [
			{
				$match: {
					$or: [
						{isApproved: true},
						{isApproved: {$exists: false}}
					]
				}
			},
			{
				$group: {
					_id: "$role",
					items: {$push: "$$ROOT"}
				}
			},
			{
				$project: {
					"items.profilePicture": 0,
					"items.password": 0,
					"items.isApproved": 0,
					"items.termsFlag": 0,
					"items.requestToDelete": 0,
					"items.identityCard": 0,
					"items.certificates": 0,
					"items.taxRegCard": 0
				}
			}
		];
		const result = await User.aggregate(query);
		const users = {};
		result.forEach(item => {
			users[item._id + "s"] = item.items;
		});

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const getUsersToDelete = async (req, res) => {
	try {
		const query = [
			{
				$match: {
					requestToDelete: true
				}
			},
			{
				$group: {
					_id: "$role",
					items: {$push: "$$ROOT"}
				}
			},
			{
				$project: {
					"items.profilePicture": 0,
					"items.password": 0,
					"items.isApproved": 0,
					"items.termsFlag": 0,

				}
			}
		];
		const result = await User.aggregate(query);
		const users = {};
		result.forEach(item => {
			users[item._id + "s"] = item.items;
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Function to set user badge based on loyalty points
const setUserBadge = (user) => {
	if (user.loyaltyPoints <= 100000) {
		user.badge = 'level 1';
	} else if (user.loyaltyPoints <= 500000) {
		user.badge = 'level 2';
	} else {
		user.badge = 'level 3';
	}
};

// Add activity booking to user
const addActivityBooking = async (req, res) => {
	const userId = req.params.id;
	const activityId = req.body.activityId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const activity = await Activity.findById(activityId);
		if (!activity) {
			return res.status(404).json({message: 'Activity not found'});
		}

		user.activityBookings.push(activityId);

		// Adjust loyalty and redeemable points based on user badge
		let pointsMultiplier = 0.5;
		if (user.badge === 'level 2') {
			pointsMultiplier = 1;
		}
		if (user.badge === 'level 3') {
			pointsMultiplier = 1.5;
		}
		user.loyaltyPoints += activity.price * pointsMultiplier;
		user.redeemablePoints += activity.price * pointsMultiplier;

		// Update badge based on new loyalty points
		setUserBadge(user);

		await user.save();
		res.status(200).json({message: 'Activity booking added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Get activity bookings of a user from the database
const getActivityBookings = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const activityBookings = await Activity.find({_id: {$in: user.activityBookings}});
		res.status(200).json(activityBookings);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Remove activity booking from user
const removeActivityBooking = async (req, res) => {
	const userId = req.params.id;
	const activityId = req.body.activityId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const index = user.activityBookings.indexOf(activityId);
		if (index === -1) {
			return res.status(400).json({message: 'Activity not found in user bookings'});
		}

		const activity = await Activity.findById(activityId);
		if (!activity) {
			return res.status(404).json({message: 'Activity not found'});
		}

		// Remove the activity from user's bookings
		user.activityBookings.splice(index, 1);

		// Adjust loyalty and redeemable points based on user badge
		let pointsMultiplier = 0.5;
		if (user.badge === 'level 2') {
			pointsMultiplier = 1;
		}
		if (user.badge === 'level 3') {
			pointsMultiplier = 1.5;
		}
		user.loyaltyPoints -= activity.price * pointsMultiplier;
		user.redeemablePoints -= activity.price * pointsMultiplier;

		// Ensure points do not go below zero
		user.loyaltyPoints = Math.max(0, user.loyaltyPoints);
		user.redeemablePoints = Math.max(0, user.redeemablePoints);

		// Update badge based on new loyalty points
		setUserBadge(user);

		await user.save();
		res.status(200).json({message: 'Activity booking removed successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Add itinerary booking to user
const addItineraryBooking = async (req, res) => {
	const userId = req.params.id;
	const itineraryId = req.body.itineraryId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		if (user.age < 18) {
			return res.status(400).json({message: 'User is under 18 years old can not book'});
		}

		const itinerary = await Itinerary.findById(itineraryId);
		if (!itinerary) {
			return res.status(404).json({message: 'Itinerary not found'});
		}

		user.itineraryBookings.push(itineraryId);

		// Adjust loyalty and redeemable points based on user badge
		let pointsMultiplier = 0.5;
		if (user.badge === 'level 2') {
			pointsMultiplier = 1;
		}
		if (user.badge === 'level 3') {
			pointsMultiplier = 1.5;
		}
		user.loyaltyPoints += itinerary.price * pointsMultiplier;
		user.redeemablePoints += itinerary.price * pointsMultiplier;

		// Update badge based on new loyalty points
		setUserBadge(user);

		await user.save();
		res.status(200).json({message: 'Itinerary booking added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Get itinerary bookings of a user from the database
const getItineraryBookings = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const itineraryBookings = await Itinerary.find({_id: {$in: user.itineraryBookings}});
		res.status(200).json(itineraryBookings);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Remove itinerary booking from user
const removeItineraryBooking = async (req, res) => {
	const userId = req.params.id;
	const itineraryId = req.body.itineraryId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const index = user.itineraryBookings.indexOf(itineraryId);
		if (index === -1) {
			return res.status(400).json({message: 'Itinerary not found in user bookings'});
		}

		const itinerary = await Itinerary.findById(itineraryId);
		if (!itinerary) {
			return res.status(404).json({message: 'Itinerary not found'});
		}

		// Remove the itinerary from user's bookings
		user.itineraryBookings.splice(index, 1);

		// Adjust loyalty and redeemable points based on user badge
		let pointsMultiplier = 0.5;
		if (user.badge === 'level 2') {
			pointsMultiplier = 1;
		}
		if (user.badge === 'level 3') {
			pointsMultiplier = 1.5;
		}
		user.loyaltyPoints -= itinerary.price * pointsMultiplier;
		user.redeemablePoints -= itinerary.price * pointsMultiplier;

		// Ensure points do not go below zero
		user.loyaltyPoints = Math.max(0, user.loyaltyPoints);
		user.redeemablePoints = Math.max(0, user.redeemablePoints);

		// Update badge based on new loyalty points
		setUserBadge(user);

		await user.save();
		res.status(200).json({message: 'Itinerary booking removed successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Add product purchase to user
const addProductPurchase = async (req, res) => {
	const userId = req.params.id;
	const productId = req.body.productId;
	const quantity = req.body.quantity;
	const itemPrice = req.body.itemPrice;
	const discount = req.body.discount;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({message: 'Product not found'});
		}

		user.productPurchases.push({
			product: productId,
			quantity,
			itemPrice,
			discount,
			datePurchased: new Date()
		});
		await user.save();

		const updatedProduct = await Product.findByIdAndUpdate(productId,
			{
				$push: {
					purchases: {
						user: userId,
						quantity,
						itemPrice,
						discount,
						datePurchased: new Date()
					}
				}
			},
			{new: true});
		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Get product purchases of a user from the database
const getProductPurchases = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const productPurchases = await Product.find({_id: {$in: user.productPurchases.map(purchase => purchase.product)}});
		res.status(200).json(productPurchases);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Remove product purchase from user
const removeProductPurchase = async (req, res) => {
	const userId = req.params.id;
	const productId = req.body.productId;
	
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		const index = user.productPurchases.findIndex(purchase => purchase.product.toString() === productId);
		if (index === -1) {
			return res.status(400).json({message: 'Product not found in user purchases'});
		}

		user.productPurchases.splice(index, 1);
		await user.save();
		res.status(200).json({message: 'Product purchase removed successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Add comment on a specific tour guide
const addComment = async (req, res) => {
	const {user, text, stars} = req.body;
	try {
		const tourGuide = await User.findById(req.params.id);

		const newComment = new Comment({user, text, stars, date: new Date()});
		await newComment.save();
		const totalRating = tourGuide.comments.length * tourGuide.rating + stars;
		const updatedReviewsCount = tourGuide.reviewsCount + 1;
		const newRating = (totalRating / updatedReviewsCount).toFixed(1);
		const userWithComment = await User.findByIdAndUpdate(
			req.params.id,
			{
				$push: {comments: newComment._id},
				$set: {rating: newRating}
			},
			{new: true}
		).populate('comments');
		res.status(201).json(userWithComment);
	} catch (error) {
		console.log(error);
		res.status(500).json({error: error.message});
	}
}

// Get all comments for a specific tour guide
const getComments = async (req, res) => {
	try {
		const tourGuide = await User.findById(req.params.id);
		if (!tourGuide) {
			return res.status(404).json({message: 'Tour guide not found'});
		}
		const comments = await Comment.find({_id: {$in: tourGuide.comments}}).populate('user', 'username');
		res.status(200).json(comments);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

const addSavedActivity = async (req, res) => {
	const userId = req.params.id;
	const activityId = req.body.activityId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const activity = await Activity.findById(activityId);
		if (!activity) {
			return res.status(404).json({message: 'Activity not found'});
		}

		// Check if the activity is already saved
		if (user.savedActivities.includes(activityId)) {
			return res.status(400).json({message: 'Activity is already saved'});
		}

		user.savedActivities.push(activityId);
		await user.save();
		res.status(200).json({message: 'Activity saved successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

//get all saved activities
const getSavedActivities = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const savedActivities = await Activity.find({_id: {$in: user.savedActivities}});
		res.status(200).json(savedActivities);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Remove saved activity
const removeSavedActivity = async (req, res) => {
	const userId = req.params.id;
	const activityId = req.body.activityId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const index = user.savedActivities.indexOf(activityId);
		if (index === -1) {
			return res.status(400).json({message: 'Activity not found in user saved activities'});
		}

		user.savedActivities.splice(index, 1);
		await user.save();
		res.status(200).json({message: 'Activity removed from saved activities successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//add a saved itinerary
const addSavedItinerary = async (req, res) => {
	const userId = req.params.id;
	const itineraryId = req.body.itineraryId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const itinerary = await Itinerary.findById(itineraryId);

		if (!itinerary) {
			return res.status(404).json({message: 'Itinerary not found'});
		}

		// Check if the itinerary is already saved
		if (user.savedItineraries.includes(itineraryId)) {
			return res.status(400).json({message: 'Itinerary is already saved'});
		}

		user.savedItineraries.push(itineraryId);
		await user.save();
		res.status(200).json({message: 'Itinerary saved successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//get all saved itineraries
const getSavedItineraries = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const savedItineraries = await Itinerary.find({_id: {$in: user.savedItineraries}});
		res.status(200).json(savedItineraries);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Remove saved itinerary
const removeSavedItinerary = async (req, res) => {
	const userId = req.params.id;
	const itineraryId = req.body.itineraryId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const index = user.savedItineraries.indexOf(itineraryId);
		if (index === -1) {
			return res.status(400).json({message: 'Itinerary not found in user saved itineraries'});
		}

		user.savedItineraries.splice(index, 1);
		await user.save();
		res.status(200).json({message: 'Itinerary removed from saved itineraries successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//add product to wishlist
const addProductToWishlist = async (req, res) => {
	const userId = req.params.id;
	const productId = req.body.productId;

	try {
		const user = await User
			.findById
			(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const product = await Product.findById
		(productId);

		if (!product) {
			return res.status(404).json({message: 'Product not found'});
		}

		// Check if the product is already saved
		if (user.productWishlist.includes(productId)) {
			return res.status(400).json({message: 'Product is already saved'});
		}

		user.productWishlist.push(productId);
		await user.save();
		res.status(200).json({message: 'Product saved successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//get all products in wishlist
const getProductWishlist = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await
			User.findById
			(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const productWishlist = await Product.find({_id: {$in: user.productWishlist}});
		res.status(200).json(productWishlist);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Remove product from wishlist
const removeProductFromWishlist = async (req, res) => {
	const userId = req.params.id;
	const productId = req.body.productId;

	try {
		const user = await User
			.findById
			(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const index = user.productWishlist.indexOf(productId);
		if (index === -1) {
			return res.status(400).json({message: 'Product not found in user product wishlist'});
		}

		user.productWishlist.splice(index, 1);
		await user.save();
		res.status(200).json({message: 'Product removed from product wishlist successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//adding product to cart
const addProductToCart = async (req, res) => {
	const userId = req.params.id;
	const productId = req.body.productId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const product = await Product.findById(productId);

		if (!product) {
			return res.status(404).json({message: 'Product not found'});
		}

		// Check if the product is already saved
		if (user.Cart.includes(productId)) {
			return res.status(400).json({message: 'Product is already in cart'});
		}

		user.Cart.push(productId);

		await user.save();
		res.status(200).json({message: 'Product added to cart successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//get all products in cart
const getCart = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const cart = await Product.find({_id: {$in: user.Cart}});
		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Remove product from cart
const removeProductFromCart = async (req, res) => {
	const userId = req.params.id;
	const productId = req.body.productId;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const index = user.Cart.indexOf(productId);
		if (index === -1) {
			return res.status(400).json({message: 'Product not found in user cart'});
		}

		user.Cart.splice(index, 1);
		await user.save();
		res.status(200).json({message: 'Product removed from cart successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Delete user with Checks
const requestDelete = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		if (user.requestToDelete) {
			return res.status(400).json({message: 'User already marked for deletion'});
		}
		if (user.role === 'admin') {
			return res.status(403).json({message: 'Admin cannot be deleted'});
		}
		if (user.role === 'tourism_governor') {
			return res.status(403).json({message: 'Tourism Governor cannot be deleted'});
		}
		if (user.role === 'tour_guide') {
			const itineraries = await Itinerary.find({createdBy: user._id});
			await Promise.all(itineraries.map(itinerary =>
				Itinerary.findByIdAndUpdate(itinerary._id, {active: false}, {new: true})
			));
		}
		if (user.role === 'seller') {
			const products = await Product.find({seller: user._id});
			await Promise.all(products.map(product =>
				Product.findByIdAndUpdate(product._id, {isArchived: true}, {new: true})
			));
		}
		if (user.role === 'advertiser') {
			const activities = await Activity.find({createdBy: user._id});
			await Promise.all(activities.map(activity =>
				Activity.findByIdAndUpdate(activity._id, {bookingOpen: false}, {new: true})
			));
		}
		if (user.role === 'tourist') {
			const activityBookings = await User.findById(user._id).populate('activityBookings', 'date').select('activityBookings');
			const now = new Date();
			const futureBookings = activityBookings.activityBookings.filter(booking => new Date(booking.date) > now);
			if (futureBookings.length > 0) {
				return res.status(403).json({message: 'User has future bookings'});
			}
			const itineraryBookings = await User.findById(user._id).populate('itineraryBookings', 'availableDates').select('itineraryBookings');
			const futureItineraryBookings = itineraryBookings.itineraryBookings.filter(booking => booking.availableDates.some(date => new Date(date) > now));
			if (futureItineraryBookings.length > 0) {
				return res.status(403).json({message: 'User has future itinerary bookings'});
			}
		}
		await User.findByIdAndUpdate(req.params.id, {requestToDelete: true}, {new: true});
		res.status(200).json({message: 'User marked for deletion'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Request OTP
const requestOtp = async (req, res) => {
	const {email} = req.body;
	try {
		const user = await User.findOne({email});
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		// Generate OTP using UUID and send it to the user's email
		const otp = UUID();

		// Send OTP to user's email
		const subject = 'Password Reset OTP';
		const message = `Your OTP is ${otp}`;

		const response = await fetch(`http://localhost:8000/api/mail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email, subject, message}),
		});

		if (response.status !== 200) {
			return res.status(500).json({message: 'Failed to send OTP'});
		}

		// Save OTP in the database
		user.otp = otp;
		await user.save();

		res.status(200).json({message: 'OTP sent successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Verify OTP and reset password
const verifyOtpAndResetPassword = async (req, res) => {
	const {email, otp, newPassword} = req.body;
	try {
		const user = await User.findOne({email});
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		if (user.otp !== otp) {
			return res.status(403).json({message: 'Invalid OTP'});
		}
		user.otp = null;
		user.password = await bcrypt.hash(newPassword, 10);
		await user.save();
		res.status(200).json({message: 'Password reset successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get new Users
const getUserAnalytics = async (req, res) => {
	try {
		const userAnalytics = await User.aggregate([
			{
				$facet: {
					byMonth: [
						{
							$group: {
								_id: {$month: "$dateCreated"},
								totalUsers: {$sum: 1},
								users: {
									$push: {
										_id: "$_id",
										firstName: "$firstName",
										lastName: "$lastName",
										email: "$email"
									}
								}
							}
						},
						{
							$sort: {"_id": 1}
						}
					],
					past30Days: [
						{
							$match: {
								dateCreated: {
									$gte: new Date(new Date().setDate(new Date().getDate() - 30))
								}
							}
						},
						{
							$group: {
								_id: null,
								totalUsers: {$sum: 1},
								users: {
									$push: {
										_id: "$_id",
										firstName: "$firstName",
										lastName: "$lastName",
										email: "$email"
									}
								}
							}
						}
					]
				}
			}
		]);

		res.status(200).json(userAnalytics);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Get sales analytics
const getSalesAnalytics = async (req, res) => {
	const userId = req.params.id;
	const {productId, startDate, endDate} = req.query;

	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}

		const match = {};

		if (user.role !== 'admin') {
			match.seller = userId;
		}

		if (productId) {
			match._id = productId;
		}

		if (startDate && endDate) {
			match['purchases.datePurchased'] = {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			};
		}

		const products = await Product.aggregate([
			{$match: match},
			{$unwind: '$purchases'},
			{
				$group: {
					_id: null,
					totalRevenue: {$sum: {$multiply: ['$purchases.quantity', {$multiply: ['$purchases.itemPrice', {$subtract: [1, '$purchases.discount']}]}]}},
					totalSales: {$sum: '$purchases.quantity'}
				}
			}
		]);

		res.json(products[0] || {totalRevenue: 0, totalSales: 0});
	} catch
		(error) {
		res.status(500).json({error: error.message});
	}
};

module.exports = {
	addUser,
	getUsers: getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	login,
	getUnapprovedUsers,
	getUserDocuments,
	getApprovedUsers,
	getUsersToDelete,
	getUsername,
	addActivityBooking,
	getActivityBookings,
	addItineraryBooking,
	getItineraryBookings,
	removeActivityBooking,
	removeItineraryBooking,
	addProductPurchase,
	getProductPurchases,
	removeProductPurchase,
	addComment,
	getComments,
	addSavedActivity,
	getSavedActivities,
	removeSavedActivity,
	addSavedItinerary,
	getSavedItineraries,
	removeSavedItinerary,
	addProductToWishlist,
	getProductWishlist,
	removeProductFromWishlist,
	addProductToCart,
	getCart,
	removeProductFromCart,
	requestDelete,
	requestOtp,
	verifyOtpAndResetPassword,
	getUserAnalytics,
	getSalesAnalytics
};