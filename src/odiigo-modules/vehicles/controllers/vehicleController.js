const asyncHandler = require('express-async-handler')
const Vehicle = require('../models/vehicle')

// Get all vehicles
// @route GET /api/vehicles

const getVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find()
    res.status(200).json(vehicles);
    // res.status(200).json({ message: "Got vehicles" });
})

// Get vehicle by ID
// @route GET /api/vehicles/:id

const getVehicleById = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id)

    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' })
    }

    res.status(200).json(vehicle);
    // res.status(200).json({ message: 'Got Vehicle with id.' })
})

// Create new vehicle
// @route POST /api/vehicles

// const createVehicle = asyncHandler(async (req, res) => {
//     const vehicle = new Vehicle(req.body)
//     await vehicle.save()

//     res.status(201).json(vehicle)
//     // res.status(201).json({ message: 'Created vehicle' })
// })
const createVehicle = asyncHandler(async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Update vehicle by ID
// route PUT /api/vehicles/:id

const updateVehicle = asyncHandler(async (req, res) => {

    // fetch vehicle
    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' })
    }

    const updateVehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true })

    res.status(200).json(updateVehicle)
    // res.status(200).json({ message: 'Updated vehicle with id.' })
})

// Delete vehicle by ID
// route DELETE /api/vehicles/:id

const deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' })
    }

    await Vehicle.findByIdAndDelete(req.params.id)
    res.status(200).json(vehicle)
    // res.status(200).json({ message: 'Deleted vehicle with id.' })
})

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
}