const express = require("express");
const router = express.Router();
const otherController = require("../controller/otherController");
const userController = require("../controller/userController");
const userRoutes = require("../routes/userRoutes");
const adminRoutes = require("../routes/adminRoutes");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.use("/", userRoutes);
router.use("/admin", adminRoutes);
router.get("/", otherController.indexPage);
router.get("/getCategory/:id", otherController.productPage);
router.get("/viewmore/:id", otherController.viewMore);
router.get("/search", otherController.searchPage);
router.get("/contactUs", otherController.contactPage);
router.get("/cart", otherController.cartPage);
router.get("/account", userController.verifyToken, otherController.profilePage);
router.get("/addToCart", userController.verifyToken, otherController.addToCart);
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

router.get("/account/checkout", userController.verifyToken, otherController.checkout);
router.post("/checkoutBegin", userController.verifyToken, otherController.checkoutBegin);
router.post("/checkoutPaymentComplete",userController.verifyToken, otherController.checkoutPaymentComplete)

router.get("/account/confirmOrders/:orderId", userController.verifyToken, otherController.confirmOrders);
router.post("/confirmOrderBegin", userController.verifyToken, otherController.confirmOrderBegin);
router.post("/confirmOrderComplete",userController.verifyToken, otherController.confirmOrderComplete)





module.exports = router;
