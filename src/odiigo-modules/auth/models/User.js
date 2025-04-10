const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Don't want to specify"],
      default: "Don't want to specify",
    },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
    lastLogin: { type: Date },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    address: [
      {
        street: { type: String },
        city: { type: String, default: "Pune" },
        state: { type: String, default: "Maharashtra" },
        zipCode: { type: String },
        country: { type: String, default: "India" },
      },
    ],
    profilePic: { type: String, default: "default-profile.jpg" },
    vehicle: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     phone: { type: String, required: true, unique: true },
//     isVerified: { type: Boolean, default: false },
//     refreshToken: { type: String },
//     lastLogin: { type: Date },
//     location: {
//         latitude: { type: Number },
//         longitude: { type: Number },
//     }, // Added location field
// }, { timestamps: true });

// const Users = mongoose.model('User', userSchema);
// module.exports = Users;
