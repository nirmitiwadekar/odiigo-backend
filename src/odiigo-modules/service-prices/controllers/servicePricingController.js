const asyncHandler = require('express-async-handler');
const ServicePricing = require('../model/pricing');
const Service = require('../../categories/services/models/services')

// @desc    Get all service pricing records
// @route   GET /api/service-pricing
// @access  Public
const getAllServicePricing = asyncHandler(async (req, res) => {
    const servicePricing = await ServicePricing.find().populate('service_id');
    res.status(200).json(servicePricing);
});

// @desc    Get service price based on car details
// @route   GET /api/service-pricing/price
// @access  Public
const getServicePrice = asyncHandler(async (req, res) => {
    const { service_id, car_make, car_model, fuel_type, transmission_type } = req.query;

    const servicePrice = await ServicePricing.findOne({
        service_id,
        car_make,
        car_model,
        fuel_type,
        transmission_type
    }).populate('service_id');

    if (!servicePrice) {
        return res.status(404).json({ message: "No pricing found for this car configuration" });
    }

    res.status(200).json({ service_price: servicePrice.service_price });
});

// @desc    Create a new service pricing entry
// @route   POST /api/service-pricing
// @access  Private (Admin only)
// const createServicePricing = asyncHandler(async (req, res) => {
//     const { service_id, car_make, car_model, fuel_type, transmission_type, service_price } = req.body;

//     const newPricing = new ServicePricing({
//         service_id,
//         car_make,
//         car_model,
//         fuel_type,
//         transmission_type,
//         service_price
//     });

//     await newPricing.save();
//     res.status(201).json(newPricing);
// });
const createServicePricing = asyncHandler(async (req, res) => {
    const { service_id, car_make, car_model, fuel_type, transmission_type, service_price } = req.body;

    // Check if the referenced service_id exists
    const serviceExists = await Service.findById(service_id);
    if (!serviceExists) {
        return res.status(400).json({ message: "Invalid service_id, service not found" });
    }

    // Prevent duplicate pricing for the same service, make, model, fuel, and transmission
    const existingPricing = await ServicePricing.findOne({
        service_id,
        car_make,
        car_model,
        fuel_type,
        transmission_type
    });

    if (existingPricing) {
        return res.status(400).json({ message: "Pricing already exists for this configuration" });
    }

    const newPricing = new ServicePricing({
        service_id,
        car_make,
        car_model,
        fuel_type,
        transmission_type,
        service_price
    });

    await newPricing.save();
    res.status(201).json(newPricing);
});


// @desc    Update service pricing entry
// @route   PUT /api/service-pricing/:id
// @access  Private (Admin only)
const updateServicePricing = asyncHandler(async (req, res) => {
    const pricing = await ServicePricing.findById(req.params.id);

    if (!pricing) {
        return res.status(404).json({ message: 'Service pricing not found' });
    }

    const updatedPricing = await ServicePricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPricing);
});

// @desc    Delete service pricing entry
// @route   DELETE /api/service-pricing/:id
// @access  Private (Admin only)
const deleteServicePricing = asyncHandler(async (req, res) => {
    const pricing = await ServicePricing.findById(req.params.id);

    if (!pricing) {
        return res.status(404).json({ message: 'Service pricing not found' });
    }

    await ServicePricing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Service pricing deleted successfully' });
});

module.exports = {
    getAllServicePricing,
    getServicePrice,
    createServicePricing,
    updateServicePricing,
    deleteServicePricing
};
