// odiigo-modules/car-model/models/CarModel.js
const mongoose = require("mongoose");

const carModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    //carIcon: { type: String },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarBrand", 
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    carImages: [{ type: String }], // Add this field for storing image URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarModel", carModelSchema);