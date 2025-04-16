<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllServicesWithVehiclePricing,
} = require("../controller/serviceController");

// Routes for services
router.get("/", getServices); // Get all services
router.get("/:id", getServiceById); // Get service by ID
router.post("/", createService); // Create a new service
router.put("/:id", updateService); // Update service by ID
router.delete("/:id", deleteService); // Delete service by ID
router.get("/with-pricing/:vehicleId", getAllServicesWithVehiclePricing);

module.exports = router;
=======
const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllServicesWithVehiclePricing,
} = require("../controller/serviceController");

// Routes for services
router.get("/", getServices); // Get all services
router.get("/:id", getServiceById); // Get service by ID
router.post("/", createService); // Create a new service
router.put("/:id", updateService); // Update service by ID
router.delete("/:id", deleteService); // Delete service by ID
router.get("/with-pricing/:vehicleId", getAllServicesWithVehiclePricing);

module.exports = router;
>>>>>>> Admin-Dashboard-new
