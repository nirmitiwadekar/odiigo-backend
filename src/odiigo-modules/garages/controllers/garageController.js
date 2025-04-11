const asyncHandler = require("express-async-handler");
const Garage = require("../models/garage");
const mongoose = require("mongoose");

// @desc    Get all garages with advanced filtering & search
// @route   GET /api/garages
// @access  Public
exports.getGarages = asyncHandler(async (req, res) => {
  const {
    q,
    name,
    status,
    _sort = "createdAt",
    _order = "desc",
    _page = 1,
    _limit = 10,
    id,
  } = req.query;

  const ownerName = req.query["ownerDetails.Name"];
  const ownerPhone = req.query["ownerDetails.Phone"];
  const ownerEmail = req.query["ownerDetails.Email"];
  const city = req.query["location.city"];
  const vehicleBrand = req.query["vehicle_type.vehicleBrand"];

  let filter = {};

  if (id) {
    if (id.includes(",")) {
      const ids = id
        .split(",")
        .map((id) => {
          try {
            return new mongoose.Types.ObjectId(id.trim());
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      if (ids.length > 0) {
        filter._id = { $in: ids };
      }
    } else {
      try {
        filter._id = new mongoose.Types.ObjectId(id);
      } catch {}
    }
  }

  if (q) {
    filter.$or = [
      { name: new RegExp(q, "i") },
      { "ownerDetails.Name": new RegExp(q, "i") },
      { "ownerDetails.Phone": new RegExp(q, "i") },
      { "ownerDetails.Email": new RegExp(q, "i") },
      { "location.city": new RegExp(q, "i") },
      // { "vehicle_type.vehicleBrand": new RegExp(q, "i") },
    ];
  }

  if (name) filter.name = new RegExp(name, "i");
  if (status) filter.status = status;
  if (ownerName) filter["ownerDetails.Name"] = new RegExp(ownerName, "i");
  if (ownerPhone) filter["ownerDetails.Phone"] = new RegExp(ownerPhone, "i");
  if (ownerEmail) filter["ownerDetails.Email"] = new RegExp(ownerEmail, "i");
  if (city) filter["location.city"] = new RegExp(city, "i");
  // if (vehicleBrand)
    // filter["vehicle_type.vehicleBrand"] = new RegExp(vehicleBrand, "i");

  const page = parseInt(_page) || 1;
  const limit = parseInt(_limit) || 10;
  const skip = (page - 1) * limit;

  const sortField = _sort === "id" ? "_id" : _sort;
  const sortOrder = _order === "asc" ? 1 : -1;
  const sortOptions = { [sortField]: sortOrder };

  try {
    const totalCount = await Garage.countDocuments(filter);

    const garages = await Garage.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      //.populate("services")
      .populate("services", "service_name")
      // .populate("vehicleBrands", "name")
      // .populate("vehicleModels", "name");

    res.setHeader("X-Total-Count", totalCount);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

    res.status(200).json({
      data: garages,
      count: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching garages:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// @desc    Get garage by ID
// @route   GET /api/garages/:id
// @access  Public
exports.getGarageById = asyncHandler(async (req, res) => {
  try {
    const garage = await Garage.findById(req.params.id)
      // .populate("service_id","service_name")
      .populate("services", "service_name")
      // .populate("vehicleBrands", "name")
      // .populate("vehicleModels", "name");

    if (!garage) {
      return res
        .status(404)
        .json({ success: false, message: "Garage not found" });
    }

    res.status(200).json({ success: true, data: garage });
  } catch (error) {
    console.error("Error fetching garage by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// @desc    Create a new garage
// @route   POST /api/garages
// @access  Public
exports.createGarage = asyncHandler(async (req, res) => {
  const { name, ownerDetails, location, services } = req.body;

  // Fixed the validation check - removing services from required fields
  if (!name || !ownerDetails || !location || !services) {

  // if (!name || !ownerDetails || !location || !vehicle_type) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
      requiredFields: [
        "name",
        "ownerDetails",
        "location",
        "services"
        // "vehicleBrands",
        // "vehicleModels",
      ],
    });
  }

  const existingGarage = await Garage.findOne({ name });
  if (existingGarage) {
    return res.status(400).json({
      success: false,
      message: "A garage with this name already exists",
    });
  }

  const garage = new Garage(req.body);
  const createdGarage = await garage.save();

  res.status(201).json({ success: true, data: createdGarage });
});

// @desc    Update a garage by ID
// @route   PUT /api/garages/:id
// @access  Public
exports.updateGarage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const { name, ownerDetails, location } = updateData;
  if (!name || !ownerDetails || !location ) {

  // if (!name || !ownerDetails || !location || !vehicle_type) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
      requiredFields: ["name", "ownerDetails", "location", /*"vehicle_type"*/],
    });
  }

  const updatedGarage = await Garage.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedGarage) {
    return res
      .status(404)
      .json({ success: false, message: "Garage not found" });
  }

  res.status(200).json({ success: true, data: updatedGarage });
});

// @desc    Delete a garage by ID
// @route   DELETE /api/garages/:id
// @access  Public
exports.deleteGarage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const garage = await Garage.findById(id);
  if (!garage) {
    return res
      .status(404)
      .json({ success: false, message: "Garage not found" });
  }

  await Garage.findByIdAndDelete(id);
  res
    .status(200)
    .json({ success: true, message: "Garage deleted successfully" });
});

module.exports = exports;
