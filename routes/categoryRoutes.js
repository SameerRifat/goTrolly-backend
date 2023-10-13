const express = require('express')
const { createCategory, deleteCategory, updateCategory, getCategories } = require('../controllers/categoryController') 
const { isAuthenticatedUser, authorizeRoles } = require('../models/auth')
const { upload } = require('../middleware/multerMiddleware')

const router = express.Router();

router.route("/categories").get(getCategories);
router.route("/admin/category/new").post(isAuthenticatedUser, authorizeRoles("admin"), upload.single('file'), createCategory);
router.route("/admin/category/:id").put(isAuthenticatedUser, authorizeRoles("admin"), upload.single('file'),  updateCategory);
router.route("/admin/category/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);

module.exports = router; 
