const asyncHandler = require('express-async-handler');
const ServicePricing = require('../model/pricing');
const Service = require('../../categories/services/models/services')

// @desc    Get all service pricing records
// @route   GET /api/service-pricing
// @access  Public
const getAllServicePricing = asyncHandler(async (req, res) => {
    const {
        q,
        service_id,
        car_make,
        car_model,
        fuel_type,
        transmission_type,
        _sort = "createdAt",
        _order = "desc",
        _page = 1,
        _limit = 10
    } = req.query;

    let filter = {};

    // Full-text search across multiple fields
    if (q) {
        filter.$or = [
            { car_make: new RegExp(q, "i") },
            { car_model: new RegExp(q, "i") },
            { fuel_type: new RegExp(q, "i") },
            { transmission_type: new RegExp(q, "i") }
        ];
    }

    // Apply individual filters
    if (service_id) filter.service_id = service_id;
    if (car_make) filter.car_make = new RegExp(car_make, "i");
    if (car_model) filter.car_model = new RegExp(car_model, "i");
    if (fuel_type) filter.fuel_type = fuel_type;
    if (transmission_type) filter.transmission_type = transmission_type;

    // Parse pagination parameters
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const skip = (page - 1) * limit;

    // Determine sorting
    const sortField = _sort === "id" ? "_id" : _sort;
    const sortOrder = _order === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    // Count total matching records
    const totalCount = await ServicePricing.countDocuments(filter);

    // Fetch paginated, filtered, and sorted data
    const servicePricing = await ServicePricing.find(filter)
        .populate({
            path: 'service_id',
            select: '_id service_name'
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

    // Set X-Total-Count header for pagination
    res.setHeader('X-Total-Count', totalCount);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

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