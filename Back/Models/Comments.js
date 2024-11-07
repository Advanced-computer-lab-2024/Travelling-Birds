const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	text: { type: String, required: true },
	date: { type: Date, default: Date.now },
	stars: { type: Number, default: 0 }
});
module.exports = mongoose.model('Comment', commentSchema);