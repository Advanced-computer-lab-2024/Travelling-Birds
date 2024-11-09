const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    title: String,
    description: String,
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
        city: String,
        country: String,
        lat: {type: Number, required: true},
        lng: {type: Number, required: true},
        address: String,
        area: String,
    },
    price: { type: Number },
    priceRange: {
        lwBound: { type: Number },
        hiBound: { type: Number }
    },
    category: { type: String, required: true },
    tags: [{ type: String, ref: 'Tag' }],
    rating: { type: Number, default: 0 },
    rank: { type: String }, // Example: "#593 of 12,398 Restaurants"
    specialDiscounts: String,
    bookingOpen: { type: Boolean, default: true },
    image: { data: Buffer, contentType: String }, // Field to store image data
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    reviewsCount:{ type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    features: [String], // Example: ["Vegetarian friendly", "Vegan options"]
    contact: {
        phone: String,
        website: String,
        email: String,
    }
});

module.exports = mongoose.model('Activity', activitySchema);
