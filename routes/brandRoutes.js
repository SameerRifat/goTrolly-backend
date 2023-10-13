const express = require('express')
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController') 
const { isAuthenticatedUser, authorizeRoles } = require('../models/auth')

const router = express.Router();

router.route("/brands").get(getBrands);
router.route("/admin/brand/new").post(isAuthenticatedUser, authorizeRoles("admin"), createBrand);
router.route("/admin/brand/:id").put(isAuthenticatedUser, authorizeRoles("admin"),  updateBrand);
router.route("/admin/brand/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBrand);

module.exports = router; 
