import mongoose, {Schema} from 'mongoose';

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
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Itinerary', itinerarySchema);