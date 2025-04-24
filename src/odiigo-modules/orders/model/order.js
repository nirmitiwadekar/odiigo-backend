  const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    services: [
        {
            service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
            service_price_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServicePricing', required: true },
            price: { type: Number, required: true }
        }
    ],
    order_status: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Pickup', 'In service', 'Closed', 'Cancelled'],
        default: 'Placed'
    },

    total_price: { type: Number, required: true }, // Auto-calculated from services

    order_date: { type: Date, default: Date.now },
    appointment_date: { type: Date, required: true },
    appointment_time: { type: String, required: true },

    pickup_required: { type: Boolean, default: true },
    pickup_address: { type: String }, // Default from User's address
    drop_address: { type: String },

    payment_status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    payment_method: {
        type: String,
        enum: ['Cash', 'Card', 'UPI', 'Net Banking'],
        required: true
    },
    payment_option: {
        type: String,
        enum: ['COD', 'Prepaid'],
        required: true
    },
    transaction_id: { type: String },
    // S3 bucket
    images: [{ type: String, required: false }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);