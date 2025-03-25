const express = require("express");
const {
    createServiceBuddy,
    getAllServiceBuddies,
    getServiceBuddyById,
    updateServiceBuddy,
    deleteServiceBuddy
} = require("../controllers/serviceBuddyController");

const router = express.Router();

// Create a new service buddy
router.post("/", createServiceBuddy);

// Get all service buddies
router.get("/", getAllServiceBuddies);

// Get a single service buddy by ID
router.get("/:id", getServiceBuddyById);

// Update a service buddy
router.put("/:id", updateServiceBuddy);

// Delete a service buddy
router.delete("/:id", deleteServiceBuddy);

module.exports = router;
