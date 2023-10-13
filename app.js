const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require('dotenv');
const path = require('path')
// import multer from 'multer';
const multer = require('multer')
const { createCategory } = require('./controllers/categoryController');

// config
dotenv.config({ path: 'backend/config/config.env' });
const errorMiddleware = require('./middleware/error');
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(cors({
    // origin: process.env.FRONTEND_URL, // Replace with your React app's domain
    origin: true, // Replace with your React app's domain
    credentials: true, // You might need this if you're using cookies or sessions
}));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());

const { fileURLToPath } = require('url');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.use("/public/assets", express.static(path.join(__dirname, '/public/assets')));  
app.use("/public/product_images", express.static(path.join(__dirname, '/public/product_images')));  
app.use("/public/color_images", express.static(path.join(__dirname, '/public/color_images')));  
// File Storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/assets')
//     },
//     filename: function (req, file, cb) {
//         console.log('file: ', file)
//         console.log('file.originalname: ', file.originalname)
//       cb(null, `${Date.now()}_${file.originalname}`)
//     }
// })
// const upload = multer({ storage })


// Route imports
const product = require('./routes/productRoutes');
const user = require('./routes/userRoutes');
// const order = require('./routes/orderRoutes');
// const payment = require('./routes/paymentRoutes');
const category = require('./routes/categoryRoutes')
const brand = require('./routes/brandRoutes')
const productType = require('./routes/productTypeRoutes')

app.use('/api/v1', product);
app.use('/api/v1', user);
// app.use('/api/v1', order);
// app.use('/api/v1', payment);
app.use('/api/v1', category);
app.use('/api/v1', brand);
app.use('/api/v1', productType);
// app.post('/api/v1/admin/category/new', createCategory)
// app.post('/api/v1/admin/category/new', upload.single('file'), createCategory)

// middleware for errors
app.use(errorMiddleware);

module.exports = app;
