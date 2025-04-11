//carBrandController.js

const CarBrand = require('../models/CarBrand');
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const s3Client = require('../../../config/aws');


// List all brand icons from S3 bucket
exports.listBrandIcons = async (req, res) => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    console.log('Using bucket:', bucketName);

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      //Prefix: 'car-brands/',
    });
    
    console.log('Sending S3 ListObjectsV2Command...');
    const s3Data = await s3Client.send(command);
    console.log('Raw S3 response:', JSON.stringify(s3Data, null, 2));
    
    if (!s3Data.Contents || s3Data.Contents.length === 0) {
      console.log('No icons found in S3 bucket');
      return res.json([]);
    }
    
    const icons = s3Data.Contents
      .filter(item => {
        const isImage = item.Key.endsWith('.png') || 
                        item.Key.endsWith('.jpg') || 
                        item.Key.endsWith('.jpeg') || 
                        item.Key.endsWith('.svg');
        return isImage;
      })
      .map(item => ({
        key: item.Key,
        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
        lastModified: item.LastModified
      }));

    console.log('Returning icons:', icons);
    res.json(icons);
  } catch (error) {
    console.error('Error listing brand icons:', error);
    res.status(500).json({ 
      message: 'Failed to list brand icons', 
      error: error.message 
    });
  }
};

// Create a new car brand
exports.createCarBrand = async (req, res) => {
  try {
    console.log('Create car brand request body:', req.body);
    console.log('Create car brand file:', req.file);
    
    const { name, status, iconKey } = req.body;
    let icon = req.body.icon; // Add this line to capture direct icon URLs

    // If icon is uploaded as file, get the URL from multer-s3
    if (req.file) {
      icon = req.file.location; // AWS S3 returns the URL in the location property
      console.log('Using uploaded file URL:', icon);
    } 
    // If user selected an existing icon from S3
    else if (iconKey) {
      const bucketName = process.env.AWS_BUCKET_NAME;
      icon = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${iconKey}`;
      console.log('Using selected icon URL:', icon);
    }
    
    const newCarBrand = new CarBrand({
      name,
      icon,
      status: status || 'active',
    });

    console.log('Saving new car brand:', newCarBrand);
    const savedBrand = await newCarBrand.save();
    console.log('Saved brand:', savedBrand);
    res.status(201).json(savedBrand);
  } catch (error) {
    console.error('Error creating car brand:', error);
    res.status(500).json({ message: 'Failed to create car brand', error: error.message });
  }
};

// Get all car brands
exports.getAllCarBrands = async (req, res) => {
  try {
    const carBrands = await CarBrand.find();
    res.json(carBrands);
  } catch (error) {
    console.error('Error getting car brands:', error);
    res.status(500).json({ message: 'Failed to get car brands', error: error.message });
  }
};

// Get car brand by ID
exports.getCarBrandById = async (req, res) => {
  try {
    const carBrand = await CarBrand.findById(req.params.id);
    if (!carBrand) {
      return res.status(404).json({ message: 'Car brand not found' });
    }
    res.json(carBrand);
  } catch (error) {
    console.error('Error getting car brand:', error);
    res.status(500).json({ message: 'Failed to get car brand', error: error.message });
  }
};

// Update car brand
exports.updateCarBrand = async (req, res) => {
  try {
    const { name, status, iconKey } = req.body;
    let icon = req.body.icon;

    // If a new icon is uploaded, use its location
    if (req.file) {
      icon = req.file.location;
    }
    // If user selected an existing icon from S3
    else if (iconKey) {
      const bucketName = process.env.AWS_BUCKET_NAME;
      icon = `https://${bucketName}.s3.amazonaws.com/${iconKey}`;
    }

    const updatedBrand = await CarBrand.findByIdAndUpdate(
      req.params.id,
      { name, icon, status },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Car brand not found' });
    }

    res.json(updatedBrand);
  } catch (error) {
    console.error('Error updating car brand:', error);
    res.status(500).json({ message: 'Failed to update car brand', error: error.message });
  }
};

// Delete car brand
exports.deleteCarBrand = async (req, res) => {
  try {
    const deletedBrand = await CarBrand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ message: 'Car brand not found' });
    }
    res.json({ message: 'Car brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting car brand:', error);
    res.status(500).json({ message: 'Failed to delete car brand', error: error.message });
  }
};