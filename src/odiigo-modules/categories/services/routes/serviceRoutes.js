const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require('../controller/serviceController');

// Routes for services
router.get('/', getServices); // Get all services
router.get('/:id', getServiceById); // Get service by ID
router.post('/', createService); // Create a new service
router.put('/:id', updateService); // Update service by ID
router.delete('/:id', deleteService); // Delete service by ID

module.exports = router;
