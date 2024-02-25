const express = require("express");
const router = express.Router();
const otherController = require("../controller/otherController");
const userController = require("../controller/userController");
const adminController = require("../controller/adminController");
const userRoutes = require("../routes/userRoutes");
const adminRoutes = require("../routes/adminRoutes");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/register", adminController.registerPage);
router.post(
  "/register",
  upload.single("adminImage"),
  adminController.validateRegister
);
router.get("/login", adminController.loginPage);
router.post("/login", adminController.loginCredentials);
router.get(
  "/dashboard",
  adminController.verifyToken,
  adminController.dashboardPage
);
router.get("/adminLogout", adminController.adminLogout);
router.get(
  "/insertProducts",
  adminController.verifyToken,
  adminController.insertProductsPage
);
router.post(
  "/insertProducts",
  adminController.verifyToken,
  upload.fields([
    { name: "product_image1", maxCount: 1 },
    { name: "product_image2", maxCount: 1 },
    { name: "product_image3", maxCount: 1 },
  ]),
  adminController.insertProducts
);

router.get("/viewProducts",adminController.verifyToken,adminController.viewProductsPage);
router.get("/deleteProducts/:productId",adminController.verifyToken,adminController.deleteProducts)
router.get("/editProducts/:productId",adminController.verifyToken,adminController.editProductsPage)

module.exports = router;
