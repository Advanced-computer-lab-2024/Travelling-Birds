//require('dotenv').config();
//const mongoose = require('mongoose');

// MongoDB connection
//mongoose.connect(process..env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
	//.then(() => console.log('MongoDB connected'))
	//.catch(err => console.log(err));
const bcrypt = require('bcryptjs');
const User = require('../Models/User');


// Register as a tourist
const registerTourist = async (req, res) => {
    const {email, username, password, mobileNumber, nationality, dob, job} = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
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
		if (!guide ) {
			return res.status(404).json({message: 'Tour guide not found'});
		}
		if (guide.isApproved === false) {
			return res.status(403).json({message: 'Tour guide profile not approved yet'});
		}
		res.status(200).json(guide);
	}
	catch(error)
		{
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
	}
	catch(error)
		{
			res.status(500).json({error: error.message});
		}
}



module.exports = {
    registerTourist,
    registerGeneric,
	readTourGuideProfile,
	updateTourGuideProfile
};