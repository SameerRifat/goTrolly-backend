const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination based on file type
    if (file.fieldname === 'productImages') {
      cb(null, './public/product_images');
    } else if (file.fieldname === 'colorImages') {
      cb(null, './public/color_images');
    } else {
      // Handle other files or throw an error if needed
      cb(new Error('Invalid file field'));
    }
  },
  filename: function (req, file, cb) {
    // Customize the filename as needed
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Use a single multer middleware to handle both types of files
exports.upload = multer({ storage }).fields([
  { name: 'productImages', maxCount: 10 },
  { name: 'colorImages', maxCount: 10 },
]);
