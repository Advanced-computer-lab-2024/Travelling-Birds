const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const activitySchema = new Schema({
	date: {type: String, required: true},
	time: {type: String, required: true},
	location: {
		lat: {type: Number,required: true},
		lng: {type: Number,required: true}
	},
	price: {type: Number},
	priceRange: {
		lwBound: {type: Number},
		hiBound: {type: Number}
	},
	category: {type: String, required: true},
	tags: [String],
	rating: {type: Number, default: 0},
	specialDiscounts: String,
	bookingOpen: {type: Boolean, default: true},
	createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Activity', activitySchema);