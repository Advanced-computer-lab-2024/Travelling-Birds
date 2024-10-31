const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
	title: {type: String, required: true},
	date: {type: Date, required: true},
	body: {type: String, required: true},
	status: {type: String, required: true},
	reply: {type: String},
	createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Complaint', complaintSchema);