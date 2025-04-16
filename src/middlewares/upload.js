// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = require('../config/aws');

// const bucketName = process.env.AWS_BUCKET_NAME;

// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: bucketName,
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       const fileName = `car-brands/${Date.now()}_${file.originalname}`;
//       cb(null, fileName);
//     },
//   }),
// });

// module.exports = upload;

// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = require('../config/aws');

// const bucketName = process.env.AWS_BUCKET_NAME;

// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: bucketName,
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: function (req, file, cb) {
//       // Determine folder based on route or a parameter in the request
//       let folder = 'uploads';
      
//       if (req.originalUrl.includes('/car-brands')) {
//         folder = 'car-brands';
//       } else if (req.originalUrl.includes('/models')) {
//         folder = 'car-models';
//       }
      
//       const fileName = `${folder}/${Date.now()}_${file.originalname}`;
//       cb(null, fileName);
//     },
//   }),
// });

// module.exports = upload;

// middlewares/upload.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../config/aws');

const bucketName = process.env.AWS_BUCKET_NAME || 'odiigo-vehicle-bucket';

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // Determine folder based on route or file field
      let folder = 'uploads';
      
      // Use the car_models folder for car model images
      if (file.fieldname === 'carImages') {
        folder = 'car_models';
      } else if (file.fieldname === 'icon') {
        folder = 'car-brands/icons';
      } else if (req.originalUrl.includes('/car-brands')) {
        folder = 'car-brands';
      } else if (req.originalUrl.includes('/car-models')) {
        folder = 'car_models';
      }
      
      const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      console.log(`Uploading file to: ${fileName}`);
      cb(null, fileName);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;