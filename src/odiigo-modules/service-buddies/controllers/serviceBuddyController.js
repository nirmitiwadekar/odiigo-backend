const asyncHandler = require("express-async-handler");
const ServiceBuddy = require("../model/serviceBuddy");

// Create a new Service Buddy
const createServiceBuddy = asyncHandler(async (req, res) => {
    const { name, phone, service_pincodes, is_available } = req.body;

    // Check if buddy with phone number already exists
    const existingBuddy = await ServiceBuddy.findOne({ phone });
    if (existingBuddy) {
        return res.status(400).json({ message: "Service Buddy with this phone number already exists" });
    }

    // Create and save service buddy
    const buddy = await ServiceBuddy.create({
        name,
        phone,
        service_pincodes,
        is_available: is_available ?? true
    });

    res.status(201).json(buddy);
});

// Get all Service Buddies
const getAllServiceBuddies = asyncHandler(async (req, res) => {
    const buddies = await ServiceBuddy.find();
    res.status(200).json(buddies);
});

// Get a single Service Buddy by ID
const getServiceBuddyById = asyncHandler(async (req, res) => {
    const buddy = await ServiceBuddy.findById(req.params.id);
    if (!buddy) {
        return res.status(404).json({ message: "Service Buddy not found" });
    }
    res.status(200).json(buddy);
});

// Update a Service Buddy
const updateServiceBuddy = asyncHandler(async (req, res) => {
    const { name, phone, service_pincodes, is_available } = req.body;

    // Find and update buddy
    const updatedBuddy = await ServiceBuddy.findByIdAndUpdate(
        req.params.id,
        { name, phone, service_pincodes, is_available },
        { new: true, runValidators: true }
    );

    if (!updatedBuddy) {
        return res.status(404).json({ message: "Service Buddy not found" });
    }

    res.status(200).json(updatedBuddy);
});

// Delete a Service Buddy
const deleteServiceBuddy = asyncHandler(async (req, res) => {
    const buddy = await ServiceBuddy.findById(req.params.id);
    if (!buddy) {
        return res.status(404).json({ message: "Service Buddy not found" });
    }

    await buddy.deleteOne();
    res.status(200).json({ message: "Service Buddy deleted successfully" });
});

module.exports = {
    createServiceBuddy,
    getAllServiceBuddies,
    getServiceBuddyById,
    updateServiceBuddy,
    deleteServiceBuddy
};
