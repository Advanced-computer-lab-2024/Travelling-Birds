const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const museumSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    openingHours: {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true }
    },
    location: {
        city: String,
        country: String,
        lat: {type: Number, required: true},
        lng: {type: Number, required: true},
        address: String,
        area: String,
    },
    ticketPrices: {
        type: Map,
        of: {
            type: Number,
            min: 0, // Optional: Validate non-negative numbers
            validate: {
                validator: function (value) {
                    // Ensure value is a number or null
                    return value === null || typeof value === 'number';
                },
                message: props => `${props.value} is not a valid ticket price`
            }
        }
    },
    tags: [{ type: String, ref: 'Tag' }],
    image: { data: Buffer, contentType: String },
    activities: [{type: Schema.Types.ObjectId, ref: 'Activity'}],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Museum', museumSchema);