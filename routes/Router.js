const express = require("express");
const router = express.Router();
const otherController = require("../controller/otherController");
const userController = require("../controller/userController");
const userRoutes = require("../routes/userRoutes");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.use("/", userRoutes);
router.get("/", otherController.IndexPage);
router.get("/getCategory/:id", otherController.ProductPage);
router.get("/viewmore/:id", otherController.ViewMore);
router.get("/search", otherController.SearchPage);
router.get("/contactUs", otherController.ContactPage);
router.get("/cart", otherController.CartPage);
router.get("/account", userController.verifyToken, otherController.ProfilePage);
router.get("/addToCart", userController.verifyToken, otherController.AddToCart);
router.post(
  "/updateQuantity",
  userController.verifyToken,
  otherController.updateQuantity
);
router.post(
  "/removeItem",
  userController.verifyToken,
  otherController.removeItem
);
router.post(
  "/getPendingOrders",
  userController.verifyToken,
  otherController.getPendingOrders
);
router.post("/myOrders", userController.verifyToken, otherController.myOrders);
router.post(
  "/cancel-order/:orderId",
  userController.verifyToken,
  otherController.cancelOrder
);
router.get(
  "/editAccount",
  userController.verifyToken,
  otherController.editAccountPage
);
router.post(
  "/account/updateAccount",
  userController.verifyToken,
  upload.single("user_image"),
  otherController.updateAccount
);
router.post(
  "/account/updateFormDataInDatabase",
  userController.verifyToken,
  upload.single("user_image"),
  otherController.updateFormDataInDatabase
);

router.get("/checkout", userController.verifyToken, otherController.checkout);
router.post("/pay_now", userController.verifyToken, otherController.paymentNow);
router.post("/capture_payment",userController.verifyToken, otherController.capturePayment)


module.exports = router;
