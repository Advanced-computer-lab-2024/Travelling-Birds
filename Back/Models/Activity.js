const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    price: { type: Number },
    priceRange: {
        lwBound: { type: Number },
        hiBound: { type: Number }
    },
    category: { type: String, required: true },
    tags: [{ type: String, ref: 'Tag' }],
    rating: { type: Number, default: 0 },
    specialDiscounts: String,
    bookingOpen: { type: Boolean, default: true },
    image: { data: Buffer, contentType: String }, // Field to store image data
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Activity', activitySchema);