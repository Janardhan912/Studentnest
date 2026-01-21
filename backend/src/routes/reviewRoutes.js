const express = require('express');
const router = express.Router();
const {
    addReview,
    getReviews,
    deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/:propertyId')
    .post(protect, authorize('student'), addReview)
    .get(getReviews);

router.route('/:reviewId')
    .delete(protect, authorize('admin'), deleteReview);

module.exports = router;
