const express = require("express");
const router = express.Router();
const {
    getPincodes,
    getPincodeById,
    createPincode,
    updatePincode,
    deletePincode,
} = require("../controllers/pincodeController");

// Get all pincodes
router.get("/", getPincodes);

// Get a single pincode by ID
router.get("/:id", getPincodeById);

// Create a new pincode
router.post("/", createPincode);

// Update an existing pincode
router.put("/:id", updatePincode);

// Delete a pincode
router.delete("/:id", deletePincode);

module.exports = router;
