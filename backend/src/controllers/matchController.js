const User = require('../models/User');
const MatchRequest = require('../models/MatchRequest');
const { calculateMatchScore } = require('../utils/matchingAlgorithm');

// @desc    Update match preferences
// @route   POST /api/match/preferences
// @access  Private/Student
const updatePreferences = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.preferences = {
        ...user.preferences,
        ...req.body
    };

    const updatedUser = await user.save();
    res.json(updatedUser.preferences);
};

// @desc    Get roommate recommendations
// @route   GET /api/match/recommendations
// @access  Private/Student
const getRecommendations = async (req, res) => {
    const currentUser = await User.findById(req.user._id);

    // Find other students who are not me
    // Also filter those who have basic preferences set?
    const students = await User.find({
        role: 'student',
        _id: { $ne: req.user._id }
    });

    const matches = students.map(student => {
        const { score, breakdown } = calculateMatchScore(currentUser, student);
        return {
            user: {
                _id: student._id,
                name: student.name,
                collegeName: student.collegeName,
                preferences: student.preferences,
                avatar: student.avatar // if exists
            },
            score,
            breakdown
        };
    });

    // Sort by score desc
    matches.sort((a, b) => b.score - a.score);

    // Return top 10
    res.json(matches.slice(0, 10));
};

// @desc    Send match request
// @route   POST /api/match/request/:studentId
// @access  Private/Student
const sendRequest = async (req, res) => {
    const toStudentId = req.params.studentId;

    // Check if exists
    const existingRequest = await MatchRequest.findOne({
        fromStudentId: req.user._id,
        toStudentId
    });

    if (existingRequest) {
        res.status(400);
        throw new Error('Request already sent');
    }

    const { score } = req.body; // Or calculate on fly

    const request = await MatchRequest.create({
        fromStudentId: req.user._id,
        toStudentId,
        score: score || 0 // Should ideally calculate here ensuring consistency
    });

    res.status(201).json(request);
};

// @desc    Respond to request
// @route   POST /api/match/respond/:requestId
// @access  Private/Student
const respondRequest = async (req, res) => {
    const { status } = req.body; // accepted, rejected

    const request = await MatchRequest.findById(req.params.requestId);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    if (request.toStudentId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to respond to this request');
    }

    request.status = status;
    await request.save();

    res.json(request);
};

// @desc    Get my requests (sent and received)
// @route   GET /api/match/requests
// @access  Private/Student
const getRequests = async (req, res) => {
    const received = await MatchRequest.find({ toStudentId: req.user._id }).populate('fromStudentId', 'name email');
    const sent = await MatchRequest.find({ fromStudentId: req.user._id }).populate('toStudentId', 'name email');

    res.json({ received, sent });
};

module.exports = {
    updatePreferences,
    getRecommendations,
    sendRequest,
    respondRequest,
    getRequests
};
