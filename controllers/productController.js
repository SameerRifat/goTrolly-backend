const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

// create product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const {
        name,
        description,
        price,
        category,
        productType,
        stock,
        brand
    } = req.body;

    const user = req.user.id; 
    const productImagePaths = [];
    const colorImagePaths = [];
    const productImages = req.files['productImages'] || [];
    const colorImages = req.files['colorImages'] || [];
    for (const obj of productImages){
        productImagePaths.push(obj.path);
    }
    for (const obj of colorImages){
        colorImagePaths.push(obj.path);
    }

    // if (req.files) {
    //     for (const file of req.files) {
    //         if (file.fieldname === 'productImages') {
    //             productImagePaths.push(file.path);
    //         } else if (file.fieldname === 'colorImages') {
    //             colorImagePaths.push(file.path);
    //         }
    //     }
    // }
    // console.log('req.files: ', req.files);
    // console.log('imagePaths: ', imagePaths);
    const productData = {
        name,
        description,
        price,
        images: productImagePaths, 
        colors: colorImagePaths,
        category,
        productType,
        stock,
        user,
    };

    // Check if brand is provided, and if so, include it in the productData
    if (brand) {
        productData.brand = brand;
    }

    const product = await Product.create(productData);
    let newProduct = {}
    if(product){
        newProduct = await Product.findById(product._id).populate('category', 'category').populate('brand','brand').populate('productType', "productType")
    }

    res.status(201).json({
        success: true,
        product: newProduct
    });
});


// get all products
exports.getAllCategories = catchAsyncErrors(async (req, res, next)=>{
    const categories = await Product.distinct('category')
    res.status(200).json({
        success: true,
        categories
    });
})
// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 400;
    const productCount = await Product.countDocuments();
    console.log('req.query', req.query);

    const apiFeature = new ApiFeatures(Product.find({ isDeleted: false }), req.query)
        .search()
        .filter()
        .sortProducts();

    // Add .populate() to populate the 'category', 'brand', and 'productType' fields
    apiFeature.query = apiFeature.query
        .populate('category', 'category')
        .populate('brand', 'brandName')
        .populate('productType', 'productType');

    let products = await apiFeature.query;
    let filteredProductsCount;
    if(products){
        filteredProductsCount = products.length;
    }
    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount
    });
});

// exports.getAllProducts = catchAsyncErrors(async (req, res, next)=>{
//     const resultPerPage = 8;
//     const productCount = await Product.countDocuments();
//     // .populate("category", "category").populate('brand', "brandName")
//     const apiFeature = new ApiFeatures(Product.find({ isDeleted: false }), req.query).search().filter().sortProducts();
//     let products = await apiFeature.query;
//     const filteredProductsCount = products.length;
//     apiFeature.pagination(resultPerPage);
//     products = await apiFeature.query.clone();
    
//     res.status(200).json({
//         success: true,
//         products,
//         productCount,
//         resultPerPage,
//         filteredProductsCount
//     });
// })
// get related products
// exports.getRelatedProducts = catchAsyncErrors(async (req, res, next)=>{
//     const resultPerPage = 8;
//     // console.log(req.query);
//     const productCount = await Product.countDocuments();
//     const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
//     let products = await apiFeature.query;
//     const filteredProductsCount = products.length;
//     apiFeature.pagination(resultPerPage);
//     products = await apiFeature.query.clone();
    
//     res.status(200).json({
//         success: true,
//         products,
//         productCount,
//         resultPerPage,
//         filteredProductsCount
//     });
// })
// get all products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next)=>{
    const products = await Product.find({ isDeleted: false }).populate("category", "category").populate('brand', "brandName").populate('productType', "productType").sort({ createdAt: -1 });
    if(!products){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        products
    });
})

// update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.id;
  
    const {
      name,
      description,
      price,
      category,
      stock,
      brand
    } = req.body;
  
    const user = req.user.id;
  
    // Check if new product images are provided
    const productImages = req.files['productImages'] || [];
    const colorImages = req.files['colorImages'] || [];
    const productImagePaths = [];
    const colorImagePaths = [];
  
    for (const obj of productImages) {
      productImagePaths.push(obj.path);
    }
  
    for (const obj of colorImages) {
      colorImagePaths.push(obj.path);
    }
  
    // Construct the updated product data
    const updatedProductData = {
      name,
      description,
      price,
      category,
      stock,
      user,
    };
  
    // Check if brand is provided, and if so, include it in the updatedProductData
    if (brand) {
      updatedProductData.brand = brand;
    }
  
    // Check if new images are provided; if so, update them
    if (productImagePaths.length > 0) {
      updatedProductData.images = productImagePaths;
    }
    if (colorImagePaths.length > 0) {
      updatedProductData.colors = colorImagePaths;
    }
  
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true })
    const newUpdatedProduct = await Product.findById(updatedProduct._id).populate('category', 'category').populate('brand', 'brand').populate('productType', "productType");
  
    if (!updatedProduct) {
      return next(new ErrorHandler('Product not found', 404));
    }
  
    res.status(200).json({
      success: true,
      product: newUpdatedProduct
    });
  });
// Update Discount
exports.updateDiscount = catchAsyncErrors(async (req, res, next) => {
    const { productIds, hasDiscount, discountPercentage } = req.body;
  
    // Update discounts for the selected products
    const updatePromises = productIds.map(async (productId) => {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          hasDiscount,
          discountPercentage,
        },
        { new: true } // This option returns the updated document
      ).exec(); // Execute the query to get the updated document
      return updatedProduct;
    });
  
    // Execute all update operations in parallel
    const updatedProducts = await Promise.all(updatePromises);
  
    // Now, you can populate the fields for each updated product individually
    const populatedUpdatedProducts = await Promise.all(
      updatedProducts.map(async (product) => {
        // Perform a separate query to populate the fields
        const populatedProduct = await Product.findById(product._id)
          .populate('category', 'category')
          .populate('brand', 'brand')
          .populate('productType', 'productType')
          .exec();
  
        return populatedProduct;
      })
    );
  
    res.status(200).json({
      success: true,
      updatedProducts: populatedUpdatedProducts
    });
  });
  
  
  
// exports.updateDiscount = catchAsyncErrors(async (req, res, next) => {
//     const { productIds, hasDiscount, discountPercentage } = req.body;

//     // Update discounts for the selected products
//     const updatePromises = productIds.map(async (productId) => {
//         const updatedProduct = await Product.findByIdAndUpdate(
//           productId,
//           {
//             hasDiscount,
//             discountPercentage,
//           },
//           { new: true } // This option returns the updated document
//         );
//         return updatedProduct;
//       });

//     // Execute all update operations in parallel
//     const updatedProducts = await Promise.all(updatePromises).populate('category', 'category').populate('brand', 'brand').populate('productType', "productType");
  
//     res.status(200).json({
//       success: true,
//       updatedProducts: updatedProducts
//     });
//   });
  

// delete products
exports.deleteProducts = catchAsyncErrors(async (req, res, next) => {
    const { productIds } = req.body;
  
    // Use the `$in` operator to find and update multiple products by their IDs
    const deletedProducts = await Product.updateMany(
      { _id: { $in: productIds } },
      { isDeleted: true }
    );
  
    if (!deletedProducts) {
      return next(new ErrorHandler("Products not found", 404));
    }
  
    res.status(200).json({
      success: true,
      deletedProductIds: productIds,
      message: "Products deleted successfully",
    });
});
  
// exports.deleteProduct = catchAsyncErrors(async (req, res, next)=>{
//     let deletedProductId = req.params.id;
//     let product = await Product.findById(req.params.id);
//     if(!product){
//         return next(new ErrorHandler("Product not found", 404))
//     }
    
//     if(product){
//         product.isDeleted = true
//     }

//     await product.save()

//     res.status(200).json({
//         success: true,
//         deletedProductId,
//         message: "product deleted successfully"
//     })
// })
// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.params.id).populate('category', 'category').populate('brand','brandName').populate('productType', "productType")
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    let relatedProducts = await Product.find({
        isDeleted: false,
        category: product.category,
        _id: {$ne: product._id}
    })

    res.status(200).json({
        success: true,
        product,
        relatedProducts
    })
})
// create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next)=>{
    const {rating , comment , productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = Number(rating)
                rev.comment = comment
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg=0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })
    product.ratings = avg/product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true
    })
})
// get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
// delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
    let avg=0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })
    let ratings = 0;
    if(reviews.length === 0){
        ratings = 0;
    }else{
        ratings = avg/reviews.length;
    }
    const numOfReviews = reviews.length;
    const result = await Product.findByIdAndUpdate(req.query.productId, {reviews, ratings, numOfReviews}, {new: true, runValidators: true, useFindAndModify: false})
    res.status(200).json({
        success: true,
    })
})