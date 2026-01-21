const express = require('express');
const router = express.Router();
const {
    updatePreferences,
    getRecommendations,
    sendRequest,
    respondRequest,
    getRequests
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here are for students
router.use(protect);
router.use(authorize('student'));

router.post('/preferences', updatePreferences);
router.get('/recommendations', getRecommendations);
router.get('/requests', getRequests);
router.post('/request/:studentId', sendRequest);
router.post('/respond/:requestId', respondRequest);

module.exports = router;
