const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');
const Product = require('../Models/Product');
const defaultProfilePicture = require('../Resources/DefaultProfilePicture');

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
			termsFlag:false,
			loyaltyPoints: 0,
			redeemablePoints: 0,
			requestToDelete: false
		});

		// Handle identity card upload if provided
		if (req.files && req.files.identityCard) {
			newUser.identityCard = {
				name: req.files.identityCard[0].originalname,
				file: {
					data: req.files.identityCard[0].buffer,
					contentType: req.files.identityCard[0].mimetype,
				},
			};
		}

		// Handle certificates upload if provided
		if (req.files && req.files.certificates) {
			newUser.certificates = req.files.certificates.map((file) => ({
				name: file.originalname,
				file: {
					data: file.buffer,
					contentType: file.mimetype,
				},
			}));
		}

		// Handle tax registration card upload if provided
		if (req.files && req.files.taxRegCard) {
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
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		return res.status(200).json(user);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}
const getUsername = async (req, res) => {
	const { username } = req.query;
	try {
		const user = await User.findOne({ username });
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
		requestToDelete
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
		// Update image data if a new file is uploaded
		if (req.file) {
			updatedFields.profilePicture = {
				data: req.file.buffer,
				contentType: req.file.mimetype
			};
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
					"items.role": 0,
					"items.isApproved": 0,
					"items.termsFlag": 0
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
            return res.status(404).json({ message: 'User not found' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        user.activityBookings.push(activityId);

        // Adjust loyalty and redeemable points based on user badge
        let pointsMultiplier = 0.5;
        if (user.badge === 'level 2') {
            pointsMultiplier = 1;
        }
        user.loyaltyPoints += activity.price * pointsMultiplier;
        user.redeemablePoints += activity.price * pointsMultiplier;

        // Update badge based on new loyalty points
        setUserBadge(user);

        await user.save();
        res.status(200).json({ message: 'Activity booking added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get activity bookings of a user from the database
const getActivityBookings = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const activityBookings = await Activity.find({ _id: { $in: user.activityBookings } });
        res.status(200).json(activityBookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove activity booking from user
const removeActivityBooking = async (req, res) => {
    const userId = req.params.id;
    const activityId = req.body.activityId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.activityBookings.indexOf(activityId);
        if (index === -1) {
            return res.status(400).json({ message: 'Activity not found in user bookings' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Remove the activity from user's bookings
        user.activityBookings.splice(index, 1);

        // Adjust loyalty and redeemable points based on user badge
        let pointsMultiplier = 0.5;
        if (user.badge === 'level 2') {
            pointsMultiplier = 1;
        }
        user.loyaltyPoints -= activity.price * pointsMultiplier;
        user.redeemablePoints -= activity.price * pointsMultiplier;

        // Ensure points do not go below zero
        user.loyaltyPoints = Math.max(0, user.loyaltyPoints);
        user.redeemablePoints = Math.max(0, user.redeemablePoints);

        // Update badge based on new loyalty points
        setUserBadge(user);

        await user.save();
        res.status(200).json({ message: 'Activity booking removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add itinerary booking to user
const addItineraryBooking = async (req, res) => {
    const userId = req.params.id;
    const itineraryId = req.body.itineraryId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        user.itineraryBookings.push(itineraryId);

        // Adjust loyalty and redeemable points based on user badge
        let pointsMultiplier = 0.5;
        if (user.badge === 'level 2') {
            pointsMultiplier = 1;
        }
        user.loyaltyPoints += itinerary.price * pointsMultiplier;
        user.redeemablePoints += itinerary.price * pointsMultiplier;

        // Update badge based on new loyalty points
        setUserBadge(user);

        await user.save();
        res.status(200).json({ message: 'Itinerary booking added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get itinerary bookings of a user from the database
const getItineraryBookings = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itineraryBookings = await Itinerary.find({ _id: { $in: user.itineraryBookings } });
        res.status(200).json(itineraryBookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove itinerary booking from user
const removeItineraryBooking = async (req, res) => {
    const userId = req.params.id;
    const itineraryId = req.body.itineraryId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.itineraryBookings.indexOf(itineraryId);
        if (index === -1) {
            return res.status(400).json({ message: 'Itinerary not found in user bookings' });
        }

        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Remove the itinerary from user's bookings
        user.itineraryBookings.splice(index, 1);

        // Adjust loyalty and redeemable points based on user badge
        let pointsMultiplier = 0.5;
        if (user.badge === 'level 2') {
            pointsMultiplier = 1;
        }
        user.loyaltyPoints -= itinerary.price * pointsMultiplier;
        user.redeemablePoints -= itinerary.price * pointsMultiplier;

        // Ensure points do not go below zero
        user.loyaltyPoints = Math.max(0, user.loyaltyPoints);
        user.redeemablePoints = Math.max(0, user.redeemablePoints);

        // Update badge based on new loyalty points
        setUserBadge(user);

        await user.save();
        res.status(200).json({ message: 'Itinerary booking removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add product purchase to user
const addProductPurchase = async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        user.productPurchases.push(productId);
        await user.save();
        res.status(200).json({ message: 'Product purchased successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get product purchases of a user from the database
const getProductPurchases = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productPurchases = await Product.find({ _id: { $in: user.productPurchases } });
        res.status(200).json(productPurchases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove product purchase from user
const removeProductPurchase = async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.productPurchases.indexOf(productId);
        if (index === -1) {
            return res.status(400).json({ message: 'Product not found in user purchases' });
        }

        user.productPurchases.splice(index, 1);
        await user.save();
        res.status(200).json({ message: 'Product purchase removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
	removeProductPurchase
};