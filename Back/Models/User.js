import mongoose, {Schema} from 'mongoose';

const user = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ['tourist', 'tour_guide', 'advertiser', 'seller', 'admin', 'tourism_governor'],
        required: true
    },
    mobileNumber: String,
    nationality: String,
    dob: Date,
    job: String,
    yearsOfExperience: Number,
    previousWork: String,
    website: String,
    hotline: String,
    companyProfile: String,
    wallet: Number
});

module.exports = mongoose.model('User', user);