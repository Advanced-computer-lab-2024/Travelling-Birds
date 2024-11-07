const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	role: {
		type: String,
		enum: ['tourist', 'tour_guide', 'advertiser', 'seller', 'admin', 'tourism_governor'],
		required: true
	},
	mobileNumber: String,
	nationality: String,
	dob: Date,
	job: String,
	yearsOfExperience: Number,
	previousWork: String,
	website: String,
	hotline: String,
	companyProfile: String,
	wallet: Number,
	isApproved: Boolean,
	description: String,
	profilePicture: { data: Buffer, contentType: String },
    termsFlag:  Boolean,
	requestToDelete: Boolean
});

module.exports = mongoose.model('User', user);