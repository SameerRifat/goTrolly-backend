const express = require("express");
const { registerUser, loginUser, logoutUser, forgtoPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSigleUser, updateUsersRole, deleteUsers } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../models/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgtoPassword);
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").get(logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSigleUser);
router.route("/admin/users/delete").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUsers);
router.route("/admin/users/updateRole").put(isAuthenticatedUser, authorizeRoles("admin"), updateUsersRole);

module.exports = router;