//carModelRoutes.js
const express = require('express');
const router = express.Router();
const carModelController = require('../controller/carModelController');
const upload = require('../../../middlewares/upload');

// CRUD routes with file upload middleware
// Allow multiple files with 'array' - up to 10 images per model
router.post('/', upload.array('carImages',10), carModelController.createCarModel);
router.get('/', carModelController.getAllCarModels);
router.get('/:id', carModelController.getCarModelById);
router.put('/:id', upload.array('carImages', 10), carModelController.updateCarModel);
router.delete('/:id', carModelController.deleteCarModel);
router.patch('/:id', upload.array('carImages', 10), carModelController.updateCarModel);


module.exports = router;