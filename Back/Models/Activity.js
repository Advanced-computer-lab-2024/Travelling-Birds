const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const activitySchema = new Schema({
	date: {type: Date, required: true},
	time: {type: String, required: true},
	location: {type: String, required: true},
	price: {type: Number, required: true},
	category: {type: String, required: true},
	tags: [String],
	specialDiscounts: String,
	bookingOpen: {type: Boolean, default: true},
	createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Activity', activitySchema);