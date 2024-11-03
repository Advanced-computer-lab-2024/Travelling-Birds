const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historicalPlaceSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    location: String,
    openingHours: {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true }
    },
    ticketPrices: [Number],
    tags: [{type: String, ref: 'Tag'}],
    image: { data: Buffer, contentType: String }, // Field to store image data
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('HistoricalPlace', historicalPlaceSchema);