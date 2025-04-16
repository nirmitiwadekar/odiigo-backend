const asyncHandler = require("express-async-handler");
const Vehicle = require("../models/vehicle");

// Get all vehicles
// @route GET /api/vehicles

// @desc    Get all vehicles with filtering, search, sorting, and pagination
// @route   GET /api/vehicles
// @access  Public
const getVehicles = asyncHandler(async (req, res) => {
    const { 
        q, 
        license_plate, 
        brand_name, 
        brand_model, 
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
            { license_plate: new RegExp(q, "i") },
            { brand_name: new RegExp(q, "i") },
            { brand_model: new RegExp(q, "i") },
            { fuel_type: new RegExp(q, "i") },
            { transmission_type: new RegExp(q, "i") },
        ];
    }

    // Apply individual filters
    if (license_plate) filter.license_plate = new RegExp(license_plate, "i");
    if (brand_name) filter.brand_name = new RegExp(brand_name, "i");
    if (brand_model) filter.brand_model = new RegExp(brand_model, "i");
    if (fuel_type) filter.fuel_type = fuel_type;
    if (transmission_type) filter.transmission_type = transmission_type;

    // Parse pagination parameters
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const skip = (page - 1) * limit;

    // Determine sort field and order
    const sortField = _sort === "id" ? "_id" : _sort;
    const sortOrder = _order === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    // Count total matching documents
    const totalCount = await Vehicle.countDocuments(filter);

    // Fetch filtered, sorted, and paginated vehicles
    const vehicles = await Vehicle.find(filter)
    //.populate('vehicle_id' ,'brand_model') // Fetch vehicle details
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-__v'); // Exclude version key

    // Set X-Total-Count header for pagination
    res.setHeader('X-Total-Count', totalCount);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

    // Return data
    res.status(200).json({
        data: vehicles,
        count: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
    });
});

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  res.status(200).json(vehicle);
  // res.status(200).json({ message: 'Got Vehicle with id.' })
});

// Create new vehicle
// @route POST /api/vehicles

// const createVehicle = asyncHandler(async (req, res) => {
//     const vehicle = new Vehicle(req.body)
//     await vehicle.save()

//     res.status(201).json(vehicle)
//     // res.status(201).json({ message: 'Created vehicle' })
// })
const createVehicle = asyncHandler(async (req, res) => {
  const { license_plate, brand_name, brand_model, fuel_type, transmission_type } = req.body;

    // Validate required fields
    if (!license_plate || !brand_name || !brand_model || !fuel_type || !transmission_type) {
        return res.status(400).json({ message: "All fields are required" });
    }
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }


    // Check for duplicate license plate
    const existingVehicle = await Vehicle.findOne({ license_plate });
    if (existingVehicle) {
        return res.status(400).json({ message: "Vehicle with this license plate already exists" });
    }

    const newVehicle = await Vehicle.create({ 
        license_plate, 
        brand_name, 
        brand_model, 
        fuel_type, 
        transmission_type 
    });

    res.status(201).json(newVehicle);
});

// @desc    Update a vehicle by ID
// @route   PUT /api/vehicles/:id
// @access  Public
const updateVehicle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Ensure required fields are present
    if (!updateData.license_plate || !updateData.brand_name || !updateData.brand_model || !updateData.fuel_type || !updateData.transmission_type) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
        id, 
        updateData, 
        { 
            new: true, 
            runValidators: true 
        }
    );

    if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

  res.status(200).json(updateVehicle);
});

// @desc    Delete a vehicle by ID
// @route   DELETE /api/vehicles/:id
// @access  Public
const deleteVehicle = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    await Vehicle.findByIdAndDelete(id);

    res.status(200).json({ message: "Vehicle deleted successfully" });
});

module.exports = {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};
