const express = require('express');
const router = express.Router();
const {
    getPendingOwners,
    verifyOwner,
    getPendingProperties,
    verifyProperty,
    getReports,
    handleReport
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/pending-owners', getPendingOwners);
router.post('/verify-owner/:ownerId', verifyOwner);
router.get('/pending-properties', getPendingProperties);
router.post('/verify-property/:propertyId', verifyProperty);
router.get('/reports', getReports);
router.post('/action/report/:reportId', handleReport);

module.exports = router;
