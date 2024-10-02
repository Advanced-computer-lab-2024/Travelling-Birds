const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historicalPlaceSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    pictures: [String],
    location: String,
    openingHours: String,
    ticketPrices: [Number],
    tags: [String],
    historicalPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'HistoricalPlace' }, // Link to historical place
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('HistoricalPlace', historicalPlaceSchema);