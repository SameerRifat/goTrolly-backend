const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProducts, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts, getAllCategories, updateDiscount } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../models/auth");
// const { upload } = require('../middleware/multerMiddleware')
const { upload } = require('../middleware/multerMiddleware2')

const router = express.Router();

// router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), upload.array('colorImages', 10), upload.array('productImages', 10), createProduct);
router.route("/admin/product/new").post(
    isAuthenticatedUser,
    upload,
    createProduct
  );
router.route("/products").get(getAllProducts);
// router.route("/categories").get(getAllCategories);
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), upload, updateProduct);
router.route("/admin/products/delete").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProducts);
router.route("/product/:id").get(getProductDetails);
router.route("/admin/products/updateDiscount").put(isAuthenticatedUser, authorizeRoles("admin"), updateDiscount);
// router.route("/review").put(isAuthenticatedUser, createProductReview);
// router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;