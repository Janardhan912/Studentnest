const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number },
    address: { type: String, required: true },
    city: { type: String, required: true },
    genderAllowed: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
    amenities: [{ type: String }],
    rules: [{ type: String }],
    images: [{ type: String }],
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    verified: { type: Boolean, default: false },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
