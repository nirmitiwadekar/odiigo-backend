const express = require('express');
const router = express.Router();
const upload = require('../../../middlewares/upload');

const {
  createCarBrand,
  getAllCarBrands,
  getCarBrandById,
  updateCarBrand,
  deleteCarBrand,
  listBrandIcons
} = require('../controller/carBrandController');

// List all icons from S3 bucket 
router.get('/icons', listBrandIcons);

// CRUD operations
router.post('/', upload.single('icon'), createCarBrand);
router.get('/', getAllCarBrands);
router.get('/:id', getCarBrandById);
router.put('/:id', upload.single('icon'), updateCarBrand);
router.delete('/:id', deleteCarBrand);

module.exports = router;