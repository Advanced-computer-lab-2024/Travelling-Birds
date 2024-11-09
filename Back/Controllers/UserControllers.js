const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const Activity = require('../Models/Activity');
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

// Get specific username
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
		const user = await User.findById(userId);
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

// add activity booking to user
const addActivityBooking = async (req, res) => {
	const userId = req.params.id;
	const activityId = req.body.activityId;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		user.activityBookings.push(activityId);
		await user.save();
		res.status(200).json({message: 'Activity booking added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// get activity bookings of a user from database
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
}

// Remove activity booking from user
const removeActivityBooking = async (req, res) => {
    const userId = req.params.id;
    const activityId = req.body.activityId;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the activity is already booked
        const index = user.activityBookings.indexOf(activityId);
        if (index === -1) {
            return res.status(400).json({ message: 'Activity not found in user bookings' });
        }

        // Remove the activity from user's bookings
        user.activityBookings.splice(index, 1);
        await user.save();

        res.status(200).json({ message: 'Activity booking removed successfully' });
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
	removeActivityBooking
};