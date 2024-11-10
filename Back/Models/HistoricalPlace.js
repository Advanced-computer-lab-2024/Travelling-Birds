const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historicalPlaceSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    openingHours: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    },
    location: {
        city: String,
        country: String,
        lat: {type: Number, required: true},
        lng: {type: Number, required: true},
        address: String,
        area: String,
    },
    ticketPrices: [Number],
    tags: [{type: String, ref: 'Tag'}],
    image: { data: Buffer, contentType: String }, // Field to store image data
    activities: [{type: Schema.Types.ObjectId, ref: 'Activity'}],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('HistoricalPlace', historicalPlaceSchema);