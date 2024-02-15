const express = require("express");
const router = express.Router();
const otherController = require("../controller/otherController");
const userController = require("../controller/userController");
const userRoutes = require("../routes/userRoutes");

router.use("/", userRoutes);
router.get("/", otherController.IndexPage);
router.get("/getCategory/:id", otherController.ProductPage);
router.get("/viewmore/:id", otherController.ViewMore);
router.get("/search", otherController.SearchPage);
router.get("/contactUs", otherController.ContactPage);
router.get("/cart", otherController.CartPage);
router.get("/account", userController.verifyToken, otherController.ProfilePage);
router.get("/addToCart", userController.verifyToken, otherController.AddToCart);
router.post('/updateQuantity', userController.verifyToken, otherController.updateQuantity);
router.post('/removeItem', userController.verifyToken, otherController.removeItem);
router.post('/getPendingOrders', userController.verifyToken, otherController.getPendingOrders);

module.exports = router;
