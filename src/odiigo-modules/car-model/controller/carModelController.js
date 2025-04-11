// odiigo-modules/car-model/controller/carModelController.js
const CarModel = require('../models/CarModel');
const CarBrand = require('../../car-brands/models/CarBrand');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../../../config/aws');

// Get all car models
exports.getAllCarModels = async (req, res) => {
  try {
    const carModels = await CarModel.find().populate('brand', 'name');
    res.json(carModels);
  } catch (error) {
    console.error('Error getting car models:', error);
    res.status(500).json({ message: 'Failed to get car models', error: error.message });
  }
};

// Get car model by ID
exports.getCarModelById = async (req, res) => {
  try {
    const carModel = await CarModel.findById(req.params.id).populate('brand', 'name icon');
    if (!carModel) {
      return res.status(404).json({ message: 'Car model not found' });
    }
    res.json(carModel);
  } catch (error) {
    console.error('Error getting car model:', error);
    res.status(500).json({ message: 'Failed to get car model', error: error.message });
  }
};

// Create a new car model
exports.createCarModel = async (req, res) => {
  try {
    console.log('Create car model request body:', req.body);
    console.log('Create car model files:', req.files);
    
    const { name, brand, status } = req.body;
    
    // Extract image URLs from uploaded files
    let carImages = [];
    if (req.files && req.files.length > 0) {
      carImages = req.files.map(file => file.location);
      console.log('Uploaded image URLs:', carImages);
    }
    
    const newCarModel = new CarModel({
      name,
      brand,
      status: status || 'active',
      carImages
    });

    console.log('Saving new car model:', newCarModel);
    const savedModel = await newCarModel.save();
    
    // Populate brand details before returning
    const populatedModel = await CarModel.findById(savedModel._id).populate('brand', 'name');
    
    console.log('Saved model:', populatedModel);
    res.status(201).json(populatedModel);
  } catch (error) {
    console.error('Error creating car model:', error);
    res.status(500).json({ message: 'Failed to create car model', error: error.message });
  }
};

// Update car model
// Update a car model
exports.updateCarModel = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Update request body:', req.body);
    console.log('Update uploaded files:', req.files);

    // Find existing model
    const carModel = await CarModel.findById(id);
    if (!carModel) {
      return res.status(404).json({ message: 'Car model not found' });
    }

    const { name, brand, status, existingImages, imagesToDelete } = req.body;

    // Convert JSON strings to arrays if needed
    const parsedExistingImages = existingImages ? JSON.parse(existingImages) : [];
    const parsedImagesToDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];

    // Handle new uploaded images (from req.files)
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = req.files.map(file => file.location);
    }

    // Delete selected images from S3
    if (parsedImagesToDelete.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
          Objects: parsedImagesToDelete.map((url) => {
            const key = new URL(url).pathname.substring(1); // Remove leading slash
            return { Key: key };
          }),
          Quiet: false,
        },
      };

      try {
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log('Deleted images from S3:', parsedImagesToDelete);
      } catch (s3Err) {
        console.error('S3 Deletion Error:', s3Err);
      }
    }

    // Combine existing + new images, excluding deleted ones
    const updatedCarImages = [
      ...parsedExistingImages.filter((img) => !parsedImagesToDelete.includes(img)),
      ...newImageUrls,
    ];

    // Update model fields
    carModel.name = name || carModel.name;
    carModel.brand = brand || carModel.brand;
    carModel.status = status || carModel.status;
    carModel.carImages = updatedCarImages;

    const updatedModel = await carModel.save();
    const populatedModel = await CarModel.findById(updatedModel._id).populate('brand', 'name');

    res.json(populatedModel);
  } catch (error) {
    console.error('Error updating car model:', error);
    res.status(500).json({ message: 'Failed to update car model', error: error.message });
  }
};


// Delete car model
exports.deleteCarModel = async (req, res) => {
  try {
    const carModel = await CarModel.findById(req.params.id);
    if (!carModel) {
      return res.status(404).json({ message: 'Car model not found' });
    }
    
    // Delete associated images from S3
    if (carModel.carImages && carModel.carImages.length > 0) {
      await Promise.all(carModel.carImages.map(async (imageUrl) => {
        try {
          const urlParts = imageUrl.split('/');
          const key = urlParts.slice(3).join('/');
          
          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
          });
          
          await s3Client.send(deleteCommand);
          console.log(`Deleted image: ${key}`);
        } catch (err) {
          console.error(`Failed to delete image from S3: ${imageUrl}`, err);
        }
      }));
    }

    // Delete the model from the database
    await CarModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car model deleted successfully' });
  } catch (error) {
    console.error('Error deleting car model:', error);
    res.status(500).json({ message: 'Failed to delete car model', error: error.message });
  }
};