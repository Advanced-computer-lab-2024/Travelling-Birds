import mongoose, {Schema} from 'mongoose';

const tagSchema = new Schema({
    name: {type: String, required: true, unique: true}
});

module.exports = mongoose.model('Tag', tagSchema);