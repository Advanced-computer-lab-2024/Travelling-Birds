const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
    activities: [{type: Schema.Types.ObjectId, ref: 'Activity'}],
    locations: [String],
    timeline: String,
    duration: String,
    language: String,
    price: Number,
    availableDates: [Date],
    accessibility: String,
    pickupLocation: String,
    dropoffLocation: String,
    preferences: String,
    isBooked: Boolean,

    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Itinerary', itinerarySchema);