const express = require("express");
const { 
    getGarages, 
    getGarageById, 
    createGarage, 
    updateGarage, 
    deleteGarage 
} = require("../controllers/garageController");

const router = express.Router();

router.route("/").get(getGarages).post(createGarage);
router.route("/:id").get(getGarageById).put(updateGarage).delete(deleteGarage);

module.exports = router;