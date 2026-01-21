const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'owner', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    collegeName: { type: String },
    phone: { type: String },
    preferences: {
        budget: { min: Number, max: Number },
        cleanliness: { type: Number, min: 1, max: 5 },
        sleepSchedule: { type: String, enum: ['early', 'night'] },
        smoking: { type: Boolean, default: false },
        drinking: { type: Boolean, default: false },
        introvertExtrovert: { type: Number, min: 1, max: 5 }, // 1=Introvert, 5=Extrovert
        studyHours: { type: Number },
        foodPreference: { type: String, enum: ['veg', 'non-veg', 'any'] },
        genderPreference: { type: String, enum: ['male', 'female', 'any'] }
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    createdAt: { type: Date, default: Date.now }
});

// Password match method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Pre-save hash
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

module.exports = mongoose.model('User', userSchema);
