const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: [
        {
            street: { type: String },
            city: { type: String, default : 'Pune' },
            state: { type: String,default : 'Maharashtra'},
            zipCode: { type: String },
            country: { type: String, default: "India" }                               // Default country
        }
    ],
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    dob: { type: Date, required: true }, // Date of Birth
    gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Don't want to specify"],
        default: "Don't want to specify"
    },
    profilePic: { type: String, default: "default-profile.jpg" },                     // Profile Picture URL
    vehicle: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }], 
    isActive: { type: Boolean, default: true },                                       // Account status
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userSchema, 'usersProfile');

