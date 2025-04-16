const mongoose = require('mongoose');

const servicePricingSchema = new mongoose.Schema({
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    car_make: { type: String, required: true },
    car_model: { type: String, required: true },
    fuel_type: {
        type: String,
        enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
        required: true
    },
    transmission_type: {
        type: String,
        enum: ["Manual", "Automatic"],
        required: true
    },
    service_price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ServicePricing', servicePricingSchema);
