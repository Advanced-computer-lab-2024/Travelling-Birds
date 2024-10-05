const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const museumSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    pictures: [String],
    location: String,
    openingHours: String,
    ticketPrices: {type: Map, of: Number},
    tags: [{type: String, ref: 'Tag'}],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Museum', museumSchema);