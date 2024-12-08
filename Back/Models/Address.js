const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Address = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    type: {
        type: String,
        enum: ['Apartment', 'Work', 'Home', 'Other'],
        required: true
    },
    floorNumber: { type: String, required: false },
    apartmentNumber: { type: String, required: false },
    postalCode: String,
    isDefault: { type: Boolean, default: false }
});


module.exports = mongoose.model('Address', Address);
