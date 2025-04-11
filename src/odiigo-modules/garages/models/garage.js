const mongoose = require("mongoose");

const GarageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerDetails: {
      Name: { type: String, required: true },
      Phone: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      Email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
    },
    onboardingDate: { type: Date, default: Date.now },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    vehicleBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: "CarBrand" }],
    vehicleModels: [{ type: mongoose.Schema.Types.ObjectId, ref: "CarModel" }],
        //ordersHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("garage", GarageSchema);
