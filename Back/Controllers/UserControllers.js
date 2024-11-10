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
const requestDeletion = async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, { requestToDelete: true }, { new: true });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ message: 'Deletion request submitted', data: user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Register as a tourist
// const registerTourist = async (req, res) => {
// 	const {firstName, lastName, email, username, password, mobileNumber, nationality, dob, job} = req.body;
// 	try {
// 		let profilePicture = null;
// 		if (req.file) {
// 			profilePicture = {
// 				data: req.file.buffer,
// 				contentType: req.file.mimetype
// 			};
// 		}else {
// 			// Use the imported base64 string and convert it to a buffer
// 			const imageBuffer = Buffer.from(defaultProfilePicture, 'base64');
// 			profilePicture = {
// 				data: imageBuffer,
// 				contentType: 'image/webp'
// 			};
// 		}
// 		const hashedPassword = await bcrypt.hash(password, 10);
// 		const newUser = new User({
// 			firstName,
// 			lastName,
// 			email,
// 			username,
// 			password: hashedPassword,
// 			mobileNumber,
// 			nationality,
// 			dob,
// 			job,
// 			role: 'tourist',
// 			profilePicture
// 		});
// 		await newUser.save();
// 		res.status(201).json({message: 'Tourist registered successfully'});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// };
//
// // Register as a tour guide/advertiser/seller
// const registerGeneric = async (req, res) => {
// 	const {
// 		firstName,
// 		lastName,
// 		email,
// 		username,
// 		password,
// 		role,
// 		yearsOfExperience,
// 		previousWork,
// 		website,
// 		hotline,
// 		companyProfile,
// 	} = req.body;
// 	if (!['tour_guide', 'advertiser', 'seller'].includes(role)) {
// 		return res.status(400).json({error: 'Invalid role'});
// 	}
// 	try {
// 		let profilePicture = null;
// 		if (req.file) {
// 			profilePicture = {
// 				data: req.file.buffer,
// 				contentType: req.file.mimetype
// 			};
// 		}else {
// 			// Use the imported base64 string and convert it to a buffer
// 			const imageBuffer = Buffer.from(defaultProfilePicture, 'base64');
// 			profilePicture = {
// 				data: imageBuffer,
// 				contentType: 'image/webp'
// 			};
// 		}
//
// 		const hashedPassword = await bcrypt.hash(password, 10);
// 		const newUser = new User({
// 			firstName,
// 			lastName,
// 			email,
// 			username,
// 			password: hashedPassword,
// 			role,
// 			yearsOfExperience,
// 			previousWork,
// 			website,
// 			hotline,
// 			companyProfile,
// 			isApproved: false,
// 			profilePicture
// 		});
// 		await newUser.save();
// 		res.status(201).json({message: `${role} registered successfully`});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// };
//
// // read tour_guide profile
// const readTourGuideProfile = async (req, res) => {
// 	try {
// 		const guide = await User.findById(req.params.id);
// 		if (!guide) {
// 			return res.status(404).json({message: 'Tour guide not found'});
// 		}
// 		if (guide.isApproved === false) {
// 			return res.status(403).json({message: 'Tour guide profile not approved yet'});
// 		}
// 		res.status(200).json(guide);
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }
//
// // update tour_guide profile
// const updateTourGuideProfile = async (req, res) => {
// 	const {
// 		yearsOfExperience,
// 		mobileNumber,
// 		previousWork
// 	} = req.body;
// 	try {
// 		const guide = await User.findByIdAndUpdate(req.params.id, {
// 			yearsOfExperience,
// 			mobileNumber,
// 			previousWork
// 		}, {new: true});
// 		if (!guide) {
// 			return res.status(404).json({message: 'Tour guide not found'});
// 		}
// 		if (guide.isApproved === false) {
// 			return res.status(403).json({message: 'Tour guide profile not approved yet'});
// 		}
// 		res.status(200).json({message: 'Tour guide profile updated successfully'});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }
//
// // update tourist profile
// const updateTouristProfile = async (req, res) => {
// 	const {
// 		email,
// 		mobileNumber,
// 		nationality,
// 		dob,
// 		job,
// 	} = req.body;
// 	try {
// 		const tourist = await User.findByIdAndUpdate(req.params.id, {
// 			email,
// 			mobileNumber,
// 			nationality,
// 			dob,
// 			job,
// 		}, {new: true});
// 		if (!tourist) {
// 			return res.status(404).json({message: 'Tourist not found'});
// 		}
// 		res.status(200).json({message: 'Tourist profile updated successfully'});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }
//
// // read Seller profile
// const readSellerProfile = async (req, res) => {
// 	try {
// 		const seller = await User.findById(req.params.id);
// 		if (!seller) {
// 			return res.status(404).json({message: 'seller not found'});
// 		}
// 		if (seller.isApproved === false) {
// 			return res.status(403).json({message: 'seller profile not approved yet'});
// 		}
// 		res.status(200).json(seller);
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }
//
// // update Seller Profile
// const updateSellerProfile = async (req, res) => {
// 	const {
// 		firstName,
// 		lastName,
// 		description
// 	} = req.body;
// 	try {
// 		const seller = await User.findByIdAndUpdate(req.params.id, {
// 			firstName,
// 			lastName,
// 			description
// 		}, {new: true});
// 		if (!seller) {
// 			return res.status(404).json({message: 'Seller not found'});
// 		}
// 		if (seller.isApproved === false) {
// 			return res.status(403).json({message: 'Seller profile not approved yet'});
// 		}
// 		res.status(200).json({message: 'Seller profile updated successfully'});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }
//
// //Delete account by admin
// const deleteUserByAdmin = async (req, res) => {
// 	const {username} = req.params;
//
// 	try {
// 		if (req.user.role !== 'admin') {
// 			return res.status(403).json({message: 'Only admins can delete accounts.'});
// 		}
//
// 		const user = await User.findOne({username});
// 		if (!user) {
// 			return res.status(404).json({message: 'User not found. Please check the username.'});
// 		}
//
// 		await User.deleteOne({username});
//
// 		res.status(200).json({message: 'User account deleted successfully'});
//
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// };
//
// //Add Tourism Governor
// const addTourismGovernor = async (req, res) => {
// 	const {
// 		firstName,
// 		lastName,
// 		username,
// 		email,
// 		password,
// 		mobileNumber,
// 		nationality,
// 		dob,
// 		job,
// 		yearsOfExperience,
// 		previousWork,
// 		website,
// 		hotline,
// 		companyProfile,
// 		wallet,
// 		isApproved
// 	} = req.body;
//
// 	try {
// 		let profilePicture = null;
// 		if (req.file) {
// 			profilePicture = {
// 				data: req.file.buffer,
// 				contentType: req.file.mimetype
// 			};
// 		}else {
// 			// Use the imported base64 string and convert it to a buffer
// 			const imageBuffer = Buffer.from(defaultProfilePicture, 'base64');
// 			profilePicture = {
// 				data: imageBuffer,
// 				contentType: 'image/webp'
// 			};
// 		}
// 		if (req.user.role !== 'admin') {
// 			return res.status(403).json({message: 'Only admins can add Tourism Governor.'});
// 		}
//
// 		const existingUser = await User.findOne({username});
// 		if (existingUser) {
// 			return res.status(400).json({message: 'Username already exists. Please choose a different one.'});
// 		}
//
// 		const existingEmail = await User.findOne({email});
// 		if (existingEmail) {
// 			return res.status(400).json({message: 'Email already exists. Please use a different one.'});
// 		}
//
// 		const hashedPassword = await bcrypt.hash(password, 10);
//
// 		const newTourismGoverner = new User({
// 			firstName,
// 			lastName,
// 			username,
// 			email,
// 			password: hashedPassword,
// 			role: 'tourism_governor',
// 			mobileNumber,
// 			nationality,
// 			dob,
// 			job,
// 			yearsOfExperience,
// 			previousWork,
// 			website,
// 			hotline,
// 			companyProfile,
// 			wallet,
// 			isApproved,
// 			profilePicture
// 		});
// 		await newTourismGoverner.save();
// 		res.status(201).json({message: 'User added successfully'});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }
//
// //Add another admin
// const addAdmin = async (req, res) => {
// 	const {
// 		firstName,
// 		lastName,
// 		username,
// 		email,
// 		password,
// 		mobileNumber,
// 		nationality,
// 		dob,
// 		job,
// 		yearsOfExperience,
// 		previousWork,
// 		website,
// 		hotline,
// 		companyProfile,
// 		wallet,
// 		isApproved
// 	} = req.body;
//
// 	try {
// 		let profilePicture = null;
// 		if (req.file) {
// 			profilePicture = {
// 				data: req.file.buffer,
// 				contentType: req.file.mimetype
// 			};
// 		}else {
// 			// Use the imported base64 string and convert it to a buffer
// 			const imageBuffer = Buffer.from(defaultProfilePicture, 'base64');
// 			profilePicture = {
// 				data: imageBuffer,
// 				contentType: 'image/webp'
// 			};
// 		}
//
// 		if (req.user.role !== 'admin') {
// 			return res.status(403).json({message: 'Only admins can add other admins.'});
// 		}
//
// 		const existingUser = await User.findOne({username});
// 		if (existingUser) {
// 			return res.status(400).json({message: 'Username already exists. Please choose a different one.'});
// 		}
//
// 		const existingEmail = await User.findOne({email});
// 		if (existingEmail) {
// 			return res.status(400).json({message: 'Email already exists. Please use a different one.'});
// 		}
//
// 		const hashedPassword = await bcrypt.hash(password, 10);
//
// 		const newAdmin = new User({
// 			firstName,
// 			lastName,
// 			username,
// 			email,
// 			password: hashedPassword,
// 			role: 'admin',
// 			mobileNumber,
// 			nationality,
// 			dob,
// 			job,
// 			yearsOfExperience,
// 			previousWork,
// 			website,
// 			hotline,
// 			companyProfile,
// 			wallet,
// 			isApproved,
// 			profilePicture
// 		});
// 		await newAdmin.save();
// 		res.status(201).json({message: 'Admin added successfully'});
// 	} catch (error) {
// 		res.status(500).json({error: error.message});
// 	}
// }
//
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



module.exports = {
	addUser,
	getUsers: getAllUsers,
	getUser,
	updateUser,
	deleteUser,
	requestDeletion,
	// registerTourist,
	// registerGeneric,
	// readTourGuideProfile,
	// updateTourGuideProfile,
	// updateTouristProfile,
	// readSellerProfile,
	// updateSellerProfile,
	// deleteUserByAdmin,
	// addTourismGovernor,
	// addAdmin,
	login,
	getUnapprovedUsers,
	getApprovedUsers,
	getUsersToDelete,
	getUsername,
	addActivityBooking,
	getActivityBookings,


};