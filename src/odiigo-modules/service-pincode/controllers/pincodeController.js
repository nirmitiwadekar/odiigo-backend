const asyncHandler = require("express-async-handler");
const Pincode = require("../model/servicePincode");

// Get all pincodes
const getPincodes = asyncHandler(async (req, res) => {
    const { 
        q,      // global search query
        pincode, // specific pincode filter
        area,    // specific area filter
        _sort = 'pincode',   // default sort field
        _order = 'ASC',      // default sort order
        _start = 0,          // pagination start
        _end = 10            // pagination end
    } = req.query;

    // Build query object
    let query = {};

    // Global search across pincode and area
    if (q) {
        query.$or = [
            { pincode: { $regex: q, $options: 'i' } },
            { area: { $regex: q, $options: 'i' } }
        ];
    }

    // Specific filters
    if (pincode) {
        query.pincode = { $regex: pincode, $options: 'i' };
    }

    if (area) {
        query.area = { $regex: area, $options: 'i' };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[_sort] = _order === 'ASC' ? 1 : -1;

    // Pagination and query
    const totalCount = await Pincode.countDocuments(query);
    const pincodes = await Pincode.find(query)
        .sort(sortOptions)
        .skip(Number(_start))
        .limit(Number(_end) - Number(_start));

    // Set headers for react-admin
    res.set('X-Total-Count', totalCount);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');

    res.status(200).json(pincodes);
});

// Get a single pincode by ID
const getPincodeById = asyncHandler(async (req, res) => {
    const pincode = await Pincode.findById(req.params.id);
    if (!pincode) {
        return res.status(404).json({ message: "Pincode not found" });
    }
    res.status(200).json(pincode);
});

// Create a new pincode
const createPincode = asyncHandler(async (req, res) => {
    const { pincode, area } = req.body;

    // Check if the pincode and area combination already exists
    const existingPincode = await Pincode.findOne({ pincode, area });
    if (existingPincode) {
        return res.status(400).json({ message: "Pincode with this area already exists" });
    }

    const newPincode = new Pincode({ pincode, area });
    await newPincode.save();
    res.status(201).json(newPincode);
});

// Update an existing pincode
const updatePincode = asyncHandler(async (req, res) => {
    const { pincode, area } = req.body;

    const updatedPincode = await Pincode.findByIdAndUpdate(
        req.params.id,
        { pincode, area },
        { new: true, runValidators: true }
    );

    if (!updatedPincode) {
        return res.status(404).json({ message: "Pincode not found" });
    }

    res.status(200).json(updatedPincode);
});

// Delete a pincode
const deletePincode = asyncHandler(async (req, res) => {
    const pincode = await Pincode.findById(req.params.id);
    if (!pincode) {
        return res.status(404).json({ message: "Pincode not found" });
    }

    await Pincode.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pincode deleted successfully" });
});

module.exports = {
    getPincodes,
    getPincodeById,
    createPincode,
    updatePincode,
    deletePincode,
};
