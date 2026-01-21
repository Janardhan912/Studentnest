const express = require('express');
const router = express.Router();
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getProperties)
    .post(protect, authorize('owner', 'admin'), createProperty);

router.route('/:id')
    .get(getPropertyById)
    .put(protect, authorize('owner', 'admin'), updateProperty)
    .delete(protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
