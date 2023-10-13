const express = require('express')
const { getProductTypes, createProductType, updateProductType, deleteProductType } = require('../controllers/productTypeController') 
const { isAuthenticatedUser, authorizeRoles } = require('../models/auth')

const router = express.Router();

router.route("/productTypes").get(getProductTypes);
router.route("/admin/productType/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProductType);
router.route("/admin/productType/:id").put(isAuthenticatedUser, authorizeRoles("admin"),  updateProductType);
router.route("/admin/productType/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductType);

module.exports = router; 
