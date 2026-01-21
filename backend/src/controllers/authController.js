const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, collegeName, phone } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user (don't use create with passwordHash directly if using pre-save, but wait, schema has passwordHash, not password)
    // My User model has pre-save hook that hashes `passwordHash` if modified. 
    // But usually we pass `password` and schema maps it.
    // Wait, my schema logic:
    // userSchema.pre('save', ... if (!this.isModified('passwordHash')) ... this.passwordHash = await bcrypt.hash(this.passwordHash...)
    // So I should pass the plain text password into `passwordHash` field initially? That's confusing.
    // Let's adjust the controller to standard practice:
    // Pass plain text to a virtual or just set it, but since I have a pre-save hook on 'passwordHash', I should set `passwordHash` to the plain password, and let the hook hash it?
    // Or I can just hash it here manually and skip the pre-save hook complexity or ensure pre-save handles it.
    // The pre-save hook checks `isModified('passwordHash')`.
    // If I manually hash it here, `isModified` is true. Then it re-hashes the hash! That's a bug.
    // Better implementation:
    // Remove manual hashing here and let the model handle it, OR remove the model hook and hash here.
    // I'll remove manual hashing here and let the model do it.
    // So I pass `passwordHash: password`.

    const user = await User.create({
        name,
        email,
        passwordHash: password, // The pre-save hook will hash this
        role: role || 'student',
        collegeName,
        phone,
        isVerified: false // Default to false
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Verify email (Mock)
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    // In a real app, verify token/OTP
    const { email, otp } = req.body;
    // Mock verification
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyEmail
};
