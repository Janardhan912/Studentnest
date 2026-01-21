const User = require('../models/User');
const Property = require('../models/Property');
const Report = require('../models/Report');

// @desc    Get pending owners
// @route   GET /api/admin/pending-owners
// @access  Private/Admin
const getPendingOwners = async (req, res) => {
    const owners = await User.find({ role: 'owner', isVerified: false });
    res.json(owners);
};

// @desc    Verify owner
// @route   POST /api/admin/verify-owner/:ownerId
// @access  Private/Admin
const verifyOwner = async (req, res) => {
    const user = await User.findById(req.params.ownerId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Owner verified' });
};

// @desc    Get pending properties
// @route   GET /api/admin/pending-properties
// @access  Private/Admin
const getPendingProperties = async (req, res) => {
    const properties = await Property.find({ verified: false }).populate('ownerId', 'name');
    res.json(properties);
};

// @desc    Verify property
// @route   POST /api/admin/verify-property/:propertyId
// @access  Private/Admin
const verifyProperty = async (req, res) => {
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    property.verified = true;
    await property.save();

    res.json({ message: 'Property verified' });
};

// @desc    Get reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    const reports = await Report.find({})
        .populate('propertyId', 'title')
        .populate('reportedBy', 'name');
    res.json(reports);
};

// @desc    Handle report
// @route   POST /api/admin/action/report/:reportId
// @access  Private/Admin
const handleReport = async (req, res) => {
    // Action: dismiss, delete-property, etc.
    const { action } = req.body; // 'resolve', 'remove-property'

    const report = await Report.findById(req.params.reportId);
    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    if (action === 'remove-property') {
        await Property.findByIdAndDelete(report.propertyId);
        report.status = 'removed';
    } else {
        report.status = 'resolved';
    }

    await report.save();
    res.json(report);
};

module.exports = {
    getPendingOwners,
    verifyOwner,
    getPendingProperties,
    verifyProperty,
    getReports,
    handleReport
};
