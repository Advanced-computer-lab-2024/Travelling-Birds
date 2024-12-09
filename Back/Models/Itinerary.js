const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
	title: {type: String, required: true},
	description: String,
	activities: [{type: Schema.Types.ObjectId, ref: 'Activity'}],
	locations: [String],
	language: String,
	price: Number,
	availableDates: [Date],
	accessibility: String,
	pickupLocation: String,
	dropoffLocation: String,
	preferences: String,
	isBooked: Boolean,
	image: {data: Buffer, contentType: String}, // Field to store image data
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
	createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	flaggedInappropriate: {type: Boolean, default: false},
	active: {type: Boolean, default: true},
	bookings: [
		{
			user: {type: Schema.Types.ObjectId, ref: 'User'},
			bookingPrice: Number,
			discount: Number,
			dateBooked: {type: Date, default: Date.now},
		}
	]
});

module.exports = mongoose.model('Itinerary', itinerarySchema);