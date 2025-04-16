const asyncHandler = require("express-async-handler");
const ServiceBuddy = require("../model/serviceBuddy");
const mongoose = require('mongoose');

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

// Get all Service Buddies with advanced filtering
const getAllServiceBuddies = asyncHandler(async (req, res) => {
    const { 
        q, 
        name, 
        phone, 
        is_available,
        _sort = "createdAt",
        _order = "desc",
        _page = 1,
        _limit = 10,
        id
    } = req.query;

    let filter = {};

    // Handle ID array for getMany requests
    if (id) {
        if (id.includes(',')) {
            const ids = id.split(',').map(id => {
                try {
                    return new mongoose.Types.ObjectId(id.trim());
                } catch (err) {
                    console.warn(`Invalid ObjectId format: ${id}`);
                    return null;
                }
            }).filter(id => id !== null);
            
            if (ids.length > 0) {
                filter._id = { $in: ids };
            }
        } else {
            try {
                filter._id = new mongoose.Types.ObjectId(id);
            } catch (err) {
                console.warn(`Invalid ObjectId format: ${id}`);
            }
        }
    }

    // Full-text search across multiple fields
    if (q) {
        filter.$or = [
            { name: new RegExp(q, "i") },
            { phone: new RegExp(q, "i") }
        ];
    }

    // Apply individual filters
    if (name) filter.name = new RegExp(name, "i");
    if (phone) filter.phone = new RegExp(phone, "i");
    if (is_available !== undefined) {
        filter.is_available = is_available === 'true' || is_available === true;
    }

    // Parse pagination params
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 10;
    const skip = (page - 1) * limit;

    // Parse sorting params
    const sortField = _sort === "id" ? "_id" : _sort;
    const sortOrder = _order === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    try {
        // Get total count for pagination
        const totalCount = await ServiceBuddy.countDocuments(filter);

        // Execute query with pagination and sorting
        const buddies = await ServiceBuddy.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate("service_pincodes", "area pincode"); 

        // Set response headers for pagination
        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

        // Return data 
        res.status(200).json({
            data: buddies,
            count: totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (error) {
        console.error("Error fetching service buddies:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get a single Service Buddy by ID
const getServiceBuddyById = asyncHandler(async (req, res) => {
    const buddy = await ServiceBuddy.findById(req.params.id).populate("service_pincodes", "area pincode");
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
    ).populate("service_pincodes", "area pincode");


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