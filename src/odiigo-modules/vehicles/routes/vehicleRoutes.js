const express = require('express');
const router = express.Router();

const { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController')

router.route("/").get(getVehicles);

router.route("/:id").get(getVehicleById);

router.route("/").post(createVehicle)

router.route("/:id").put(updateVehicle);

router.route("/:id").delete(deleteVehicle);


module.exports = router;