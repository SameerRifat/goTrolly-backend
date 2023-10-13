// import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
// import Category from "../models/categoryModel.js";
// import ErrorHandler from "../utils/errorHandler.js";
// import fs from 'fs';
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Category = require('../models/categoryModel');
const ErrorHandler = require('../utils/errorHandler');
const fs = require('fs')

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const { category } = req.body;
    if (!category) {
      return next(new ErrorHandler("Please provide a category name", 400));
    }
    if (!req.file) {
      return next(new ErrorHandler("Please upload an image for the category", 400));
    }
  
    const newCategory = await Category.create({ category, categoryImage: req.file.path});

    res.status(201).json({
    success: true,
    category: newCategory,
    });
  });
  

// get all categories
exports.getCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find({ isDeleted: false });

    if (!categories || categories.length === 0) {
        return next(new ErrorHandler("No categories found", 400));
    }

    res.status(200).json({
        success: true,
        categories,
    });
});


// update category
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404))
    }
    const newCategoryData = {
        category: req.body.category
    }
    // Check if a new image file is uploaded
    if (req.file) {
        // Remove the old image from the assets folder if it exists
        if (category.categoryImage) {
            fs.unlinkSync(category.categoryImage); // Delete the old image file
        }
        newCategoryData.categoryImage = req.file.path;
    }

    // Update the category name if provided
    category = await Category.findByIdAndUpdate(req.params.id, newCategoryData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        category
    });
});


// delete category
exports.deleteCategory = catchAsyncErrors(async (req, res, next)=>{
    let deletedCategoryId = req.params.id;
    let category = await Category.findById(req.params.id);
    if(!category){
        return next(new ErrorHandler("Category not found", 404))
    }
    
    // if (category.categoryImage) {
    //     fs.unlinkSync(category.categoryImage); // Delete the old image file
    // }
    // await category.remove();
    if(category){
        category.isDeleted = true
    }

    await category.save()

    res.status(200).json({
        success: true,
        deletedCategoryId,
        message: "category deleted successfully"
    })
}) 