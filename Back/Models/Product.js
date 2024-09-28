import mongoose, {Schema} from 'mongoose';

const productSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    availableQuantity: {type: Number, required: true},
    picture: String,
    seller: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    ratings: [Number],
    reviews: [String]
});

module.exports = mongoose.model('Product', productSchema);