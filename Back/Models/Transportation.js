const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transportationSchema = new Schema({
    name: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Linking to User
});

module.exports = mongoose.model('Transportation', transportationSchema);