const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    availableQuantity: {type: Number, required: true},
    picture:  { data: Buffer, contentType: String },
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    ratings: {type: Number, default: 0},
    reviews: [String],
    soldQuantity:Number,
    soldOut: { type: Boolean, default: false },
    userPurchased: [{type: Schema.Types.ObjectId, ref: 'User'}],
    isArchived: {type: Boolean, default: false},
});


module.exports = mongoose.model('Product', productSchema);