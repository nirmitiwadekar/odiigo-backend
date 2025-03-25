const asyncHandler = require("express-async-handler");
const Pincode = require("../model/servicePincode");

// Get all pincodes
const getPincodes = asyncHandler(async (req, res) => {
    const pincodes = await Pincode.find();
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
