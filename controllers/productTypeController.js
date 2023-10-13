const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ProductType = require('../models/productTypeModel');
const ErrorHandler = require('../utils/errorHandler');

exports.createProductType = catchAsyncErrors(async (req, res, next) => {
    const { productType, categoryId } = req.body;
    // console.log(req.body)
    if (!productType || !categoryId) {
        return next(new ErrorHandler("Please provide product type name and categoryId", 400));
    }
  
    let newProductType = await ProductType.create({ productType, categoryId });
    if(newProductType){
        newProductType = await ProductType.findById(newProductType._id).populate('categoryId', 'category');
    }
    res.status(201).json({
    success: true,
    productType: newProductType,
    });
  });
  

// get all productTypes
exports.getProductTypes = catchAsyncErrors(async (req, res, next) => {
    const productTypes = await ProductType.find({ isDeleted: false }).populate('categoryId', 'category').sort({ createdAt: -1 });

    if (!productTypes || productTypes.length === 0) {
        return next(new ErrorHandler("No productTypes found", 404));
    }

    res.status(200).json({
        success: true,
        productTypes,
    });
});


// update category
exports.updateProductType = catchAsyncErrors(async (req, res, next) => {
    let productType = await ProductType.findById(req.params.id);
    if (!productType) {
        return next(new ErrorHandler("ProductType not found", 404));
    }

    productType = await productType.save();

    productType = await ProductType.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    if(productType){
        productType = await ProductType.findById(req.params.id).populate('categoryId', 'category');
    }

    res.status(200).json({
        success: true,
        productType,
    });
});



// delete productType
exports.deleteProductType = catchAsyncErrors(async (req, res, next) => {
    const deletedProductTypeId = req.params.id;
    const productType = await ProductType.findById(req.params.id);

    if (!productType) {
        return next(new ErrorHandler("ProductType not found", 404));
    }

    productType.isDeleted = true;

    await productType.save();

    res.status(200).json({
        success: true,
        deletedProductTypeId,
        message: "ProductType deleted successfully",
    });
});
