const express = require('express');
const router = express.Router();
const {
    createServicePricing,
    getAllServicePricing,
    getServicePrice,
    updateServicePricing,
    deleteServicePricing
} = require('../controllers/servicePricingController');


router.post('/', createServicePricing);
router.get('/', getAllServicePricing);
router.get('/:id', getServicePrice);
router.put('/:id', updateServicePricing);
router.delete('/:id', deleteServicePricing);

module.exports = router;
