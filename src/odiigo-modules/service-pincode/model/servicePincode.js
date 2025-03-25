const mongoose = require("mongoose");

const pincodeSchema = new mongoose.Schema(
    {
        pincode: {
            type: String,
            required: [true, "Pincode is required"],
            trim: true,
            minlength: 4,
            maxlength: 10,
        },
        area :{
            type: String,
            required: [true, "Area is required"],
            trim: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Pincode", pincodeSchema);