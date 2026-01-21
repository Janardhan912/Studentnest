const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Filters
    const filters = {};
    if (req.query.city) filters.city = req.query.city;
    if (req.query.genderAllowed) filters.genderAllowed = req.query.genderAllowed;
    if (req.query.verified) filters.verified = req.query.verified === 'true';

    const count = await Property.countDocuments({ ...filters, ...keyword });
    const properties = await Property.find({ ...filters, ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ properties, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email');

    if (property) {
        res.json(property);
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Owner
const createProperty = async (req, res) => {
    const {
        title,
        rent,
        deposit,
        address,
        city,
        genderAllowed,
        amenities,
        rules,
        images,
        location
    } = req.body;

    const property = new Property({
        ownerId: req.user._id,
        title,
        rent,
        deposit,
        address,
        city,
        genderAllowed,
        amenities,
        rules,
        images,
        location,
        verified: false // Requires admin approval
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Owner
const updateProperty = async (req, res) => {
    const {
        title,
        rent,
        deposit,
        address,
        city,
        genderAllowed,
        amenities,
        rules,
        images,
        location
    } = req.body;

    const property = await Property.findById(req.params.id);

    if (property) {
        if (property.ownerId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this property');
        }

        property.title = title || property.title;
        property.rent = rent || property.rent;
        property.deposit = deposit || property.deposit;
        property.address = address || property.address;
        property.city = city || property.city;
        property.genderAllowed = genderAllowed || property.genderAllowed;
        property.amenities = amenities || property.amenities;
        property.rules = rules || property.rules;
        property.images = images || property.images;
        property.location = location || property.location;

        const updatedProperty = await property.save();
        res.json(updatedProperty);
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Owner
const deleteProperty = async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (property) {
        if (property.ownerId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this property');
        }

        await property.deleteOne();
        res.json({ message: 'Property removed' });
    } else {
        res.status(404);
        throw new Error('Property not found');
    }
};

module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
};
