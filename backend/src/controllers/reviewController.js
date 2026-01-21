const Review = require('../models/Review');
const Property = require('../models/Property');

// @desc    Add review to property
// @route   POST /api/reviews/:propertyId
// @access  Private/Student
const addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const propertyId = req.params.propertyId;

    const property = await Property.findById(propertyId);

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
        propertyId,
        userId: req.user._id
    });

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
    }

    const review = await Review.create({
        propertyId,
        userId: req.user._id,
        rating: Number(rating),
        comment
    });

    // Start Update avg rating
    // Ideally this should be an aggregation, but simple math works for now or triggers
    const reviews = await Review.find({ propertyId });
    property.ratingCount = reviews.length;
    property.ratingAvg =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await property.save();

    res.status(201).json(review);
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/:propertyId
// @access  Public
const getReviews = async (req, res) => {
    const reviews = await Review.find({ propertyId: req.params.propertyId }).populate('userId', 'name');
    res.json(reviews);
};

// @desc    Delete review
// @route   DELETE /api/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
};

module.exports = {
    addReview,
    getReviews,
    deleteReview
};
