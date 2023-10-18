const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, ordersSummary, deleteOrders } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../models/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router.route("/admin/summary").get(isAuthenticatedUser, authorizeRoles("admin"), ordersSummary);
router.route("/admin/orders/delete").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrders);

module.exports = router;