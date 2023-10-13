// import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
// import Category from "../models/categoryModel.js";
// import ErrorHandler from "../utils/errorHandler.js";
// import fs from 'fs';
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Brand = require('../models/brandModel');
const ErrorHandler = require('../utils/errorHandler');
const fs = require('fs')

exports.createBrand = catchAsyncErrors(async (req, res, next) => {
    const { brandName, categoryId } = req.body;
    // console.log(req.body)
    if (!brandName || !categoryId) {
        return next(new ErrorHandler("Please provide brand name and categoryId", 400));
    }
  
    let newBrand = await Brand.create({ brandName, categoryId });
    if(newBrand){
        newBrand = await Brand.findById(newBrand._id).populate('categoryId', 'category');
    }
    res.status(201).json({
    success: true,
    brand: newBrand,
    });
  });
  

// get all brands
exports.getBrands = catchAsyncErrors(async (req, res, next) => {
    const brands = await Brand.find({ isDeleted: false }).populate('categoryId', 'category')

    if (!brands || brands.length === 0) {
        return next(new ErrorHandler("No brands found", 404));
    }

    res.status(200).json({
        success: true,
        brands,
    });
});


// update category
exports.updateBrand = catchAsyncErrors(async (req, res, next) => {
    let brand = await Brand.findById(req.params.id);
    if (!brand) {
        return next(new ErrorHandler("Brand not found", 404));
    }

    brand = await brand.save();

    brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    if(brand){
        brand = await Brand.findById(req.params.id).populate('categoryId', 'category');
    }

    res.status(200).json({
        success: true,
        brand,
    });
});



// delete category
exports.deleteBrand = catchAsyncErrors(async (req, res, next) => {
    const deletedBrandId = req.params.id;
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        return next(new ErrorHandler("Brand not found", 404));
    }

    brand.isDeleted = true;

    await brand.save();

    res.status(200).json({
        success: true,
        deletedBrandId,
        message: "Brand deleted successfully",
    });
});
