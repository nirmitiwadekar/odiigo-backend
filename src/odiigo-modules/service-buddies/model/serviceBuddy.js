const mongoose = require("mongoose");

const serviceBuddySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, unique: true, trim: true },
        service_pincodes: [{ type: String, required: true }], // Array of pincodes the buddy serves
        is_available: { type: Boolean, default: true } // Check if buddy is available for assignment
    },
    { timestamps: true }
);

module.exports = mongoose.model("ServiceBuddy", serviceBuddySchema);
