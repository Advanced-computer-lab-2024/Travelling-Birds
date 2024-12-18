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
	profilePicture: {data: Buffer, contentType: String},
	backDrop: {data: Buffer, contentType: String},
	termsFlag: Boolean,
	loyaltyPoints: Number,
	redeemablePoints: Number,
	badge: String,
	requestToDelete: Boolean,
	identityCard: {name: {type: String}, file: {data: Buffer, contentType: String}},
	certificates: [{name: {type: String}, file: {data: Buffer, contentType: String}}],
	taxRegCard: {name: {type: String}, file: {data: Buffer, contentType: String}},
	// activityBookings: [{type: Schema.Types.ObjectId, ref: 'Activity'}],
	activityBookings: [
		{
			activity: {type: Schema.Types.ObjectId, ref: 'Activity'},
			activityPrice: Number,
			discount: Number,
			dateBooked: {type: Date, default: Date.now},
		}
	],
	savedActivities: [{type: Schema.Types.ObjectId, ref: 'Activity'}],
	// itineraryBookings: [{type: Schema.Types.ObjectId, ref: 'Itinerary'}],
	itineraryBookings: [
		{
			itinerary: {type: Schema.Types.ObjectId, ref: 'Itinerary'},
			itineraryPrice: Number,
			discount: Number,
			dateBooked: {type: Date, default: Date.now},
		}
	],
	savedItineraries: [{type: Schema.Types.ObjectId, ref: 'Itinerary'}],
	productPurchases: [
		{
			product: {type: Schema.Types.ObjectId, ref: 'Product'},
			quantity: Number,
			itemPrice: Number,
			discount: Number,
			datePurchased: {type: Date, default: Date.now},
		}
	],
	productWishlist: [{type: Schema.Types.ObjectId, ref: 'Product'}],
	Cart: [{type: Schema.Types.ObjectId, ref: 'Product'}],
	address: [{type: Schema.Types.ObjectId, ref: 'Address'}],
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	ratings: Number,
	otp: String,
	dateCreated: {type: Date, default: Date.now},
	// Walkthrough flags (initially set to false)
	walkthrough:
		{
			explore : {type: Boolean, default: false},
			flights : {type: Boolean, default: false},
			hotels : {type: Boolean, default: false},
		}

});

module.exports = mongoose.model('User', user);