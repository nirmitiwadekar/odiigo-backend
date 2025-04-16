const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    service_name: { type: String, required: true },
    service_details: [{ type: String, required: true }],
    included_services: [{ type: String, required: true }],
    // price: { type: Number, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
