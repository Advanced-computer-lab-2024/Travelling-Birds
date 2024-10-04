const bcrypt = require('bcryptjs');
const User = require('../Models/User');

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
		description
	} = req.body;
	try {
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
			description
		});
		await newUser.save();
		res.status(201).json({message: 'User added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// Get all users
const getUsers = async (req, res) => {
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
		res.status(200).json(user);
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
		description
	} = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.findByIdAndUpdate(req.params.id, {
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
			description
		}, {new: true});
		if (!user) {
			return res.status(404).json({message: 'User not found'});
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({error: error.message});
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

// Register as a tourist
const registerTourist = async (req, res) => {
	const {firstName, lastName, email, username, password, mobileNumber, nationality, dob, job} = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			firstName,
			lastName,
			email,
			username,
			password: hashedPassword,
			mobileNumber,
			nationality,
			dob,
			job,
			role: 'tourist'
		});
		await newUser.save();
		res.status(201).json({message: 'Tourist registered successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// Register as a tour guide/advertiser/seller
const registerGeneric = async (req, res) => {
	const {
		firstName,
		lastName,
		email,
		username,
		password,
		role,
		yearsOfExperience,
		previousWork,
		website,
		hotline,
		companyProfile,
	} = req.body;
	if (!['tour_guide', 'advertiser', 'seller'].includes(role)) {
		return res.status(400).json({error: 'Invalid role'});
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			firstName,
			lastName,
			email,
			username,
			password: hashedPassword,
			role,
			yearsOfExperience,
			previousWork,
			website,
			hotline,
			companyProfile,
			isApproved: false
		});
		await newUser.save();
		res.status(201).json({message: `${role} registered successfully`});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

// read tour_guide profile
const readTourGuideProfile = async (req, res) => {
	try {
		const guide = await User.findById(req.params.id);
		if (!guide) {
			return res.status(404).json({message: 'Tour guide not found'});
		}
		if (guide.isApproved === false) {
			return res.status(403).json({message: 'Tour guide profile not approved yet'});
		}
		res.status(200).json(guide);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// update tour_guide profile
const updateTourGuideProfile = async (req, res) => {
	const {
		yearsOfExperience,
		mobileNumber,
		previousWork
	} = req.body;
	try {
		const guide = await User.findByIdAndUpdate(req.params.id, {
			yearsOfExperience,
			mobileNumber,
			previousWork
		}, {new: true});
		if (!guide) {
			return res.status(404).json({message: 'Tour guide not found'});
		}
		if (guide.isApproved === false) {
			return res.status(403).json({message: 'Tour guide profile not approved yet'});
		}
		res.status(200).json({message: 'Tour guide profile updated successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// update tourist profile
const updateTouristProfile = async (req, res) => {
	const {
		email,
		mobileNumber,
		nationality,
		dob,
		job,
	} = req.body;
	try {
		const tourist = await User.findByIdAndUpdate(req.params.id, {
			email,
			mobileNumber,
			nationality,
			dob,
			job,
		}, {new: true});
		if (!tourist) {
			return res.status(404).json({message: 'Tourist not found'});
		}
		res.status(200).json({message: 'Tourist profile updated successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// read Seller profile
const readSellerProfile = async (req, res) => {
	try {
		const seller = await User.findById(req.params.id);
		if (!seller) {
			return res.status(404).json({message: 'seller not found'});
		}
		if (seller.isApproved === false) {
			return res.status(403).json({message: 'seller profile not approved yet'});
		}
		res.status(200).json(seller);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

// update Seller Profile
const updateSellerProfile = async (req, res) => {
	const {
		firstName,
		lastName,
		description
	} = req.body;
	try {
		const seller = await User.findByIdAndUpdate(req.params.id, {
			firstName,
			lastName,
			description
		}, {new: true});
		if (!seller) {
			return res.status(404).json({message: 'Seller not found'});
		}
		if (seller.isApproved === false) {
			return res.status(403).json({message: 'Seller profile not approved yet'});
		}
		res.status(200).json({message: 'Seller profile updated successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//not tested yet, M.haythem will conduct the necessary tests
//Delete account by admin
const deleteUserByAdmin = async (req, res) => {
	const {username} = req.params;

	try {
		if (req.user.role !== 'admin') {
			return res.status(403).json({message: 'Only admins can delete accounts.'});
		}

		const user = await User.findOne({username});
		if (!user) {
			return res.status(404).json({message: 'User not found. Please check the username.'});
		}

		await User.deleteOne({username});

		res.status(200).json({message: 'User account deleted successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
};

//Add Tourism Governor
const addTourismGovernor = async (req, res) => {
	const {
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
		isApproved
	} = req.body;

	try {
		if (req.user.role !== 'admin') {
			return res.status(403).json({message: 'Only admins can add Tourism Governor.'});
		}

		const existingUser = await User.findOne({username});
		if (existingUser) {
			return res.status(400).json({message: 'Username already exists. Please choose a different one.'});
		}

		const existingEmail = await User.findOne({email});
		if (existingEmail) {
			return res.status(400).json({message: 'Email already exists. Please use a different one.'});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newTourismGoverner = new User({
			username,
			email,
			password: hashedPassword,
			role: 'tourismGovernor',
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
			isApproved
		});
		await newTourismGoverner.save();
		res.status(201).json({message: 'User added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//Add another admin
const addAdmin = async (req, res) => {
	const {
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
		isApproved
	} = req.body;

	try {
		if (req.user.role !== 'admin') {
			return res.status(403).json({message: 'Only admins can add other admins.'});
		}

		const existingUser = await User.findOne({username});
		if (existingUser) {
			return res.status(400).json({message: 'Username already exists. Please choose a different one.'});
		}

		const existingEmail = await User.findOne({email});
		if (existingEmail) {
			return res.status(400).json({message: 'Email already exists. Please use a different one.'});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newAdmin = new User({
			username,
			email,
			password: hashedPassword,
			role: 'admin',
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
			isApproved
		});
		await newAdmin.save();
		res.status(201).json({message: 'User added successfully'});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
}

//end of test

module.exports = {
	addUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	registerTourist,
	registerGeneric,
	readTourGuideProfile,
	updateTourGuideProfile,
	updateTouristProfile,
	readSellerProfile,
	updateSellerProfile,
	deleteUserByAdmin,
	addTourismGovernor,
	addAdmin
};