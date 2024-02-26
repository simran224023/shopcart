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

router.get(
  "/viewProducts",
  adminController.verifyToken,
  adminController.viewProductsPage
);
router.get(
  "/deleteProducts/:productId",
  adminController.verifyToken,
  adminController.deleteProducts
);
router.get(
  "/editProducts/:productId",
  adminController.verifyToken,
  adminController.editProductsPage
);

router.post(
  "/editProducts/:productId",
  adminController.verifyToken,
  upload.fields([
    { name: "product_image1", maxCount: 1 },
    { name: "product_image2", maxCount: 1 },
    { name: "product_image3", maxCount: 1 },
  ]),
  adminController.editProductsValidateAndUpdate
);

router.get(
  "/product/export",
  adminController.verifyToken,
  adminController.exportProductData
);
router.get(
  "/product/import",
  adminController.verifyToken,
  adminController.importProductData
);
router.get(
  "/insertCategory",
  adminController.verifyToken,
  adminController.insertCategoryPage
);

router.post(
  "/insertCategory",
  adminController.verifyToken,
  upload.single("cat_image"),
  adminController.insertCategory
);

router.get(
  "/viewCategory",
  adminController.verifyToken,
  adminController.viewCategoryPage
);

router.get(
  "/deleteCategory/:categoryId",
  adminController.verifyToken,
  adminController.deleteCategory
);

router.get(
  "/editCategory/:categoryId",
  adminController.verifyToken,
  adminController.editCategoryPage
);

router.post(
  "/editCategory/:categoryId",
  adminController.verifyToken,
  upload.single("cate_image"),
  adminController.editCategory
);

router.get(
  "/allOrders",
  adminController.verifyToken,
  adminController.getAllOrdersPage
);

router.get(
  "/allPayments",
  adminController.verifyToken,
  adminController.getAllPaymentsPage
);

router.get(
  "/listUsers",
  adminController.verifyToken,
  adminController.getAllUsersPage
);

router.get(
  "/deleteUser/:userId",
  adminController.verifyToken,
  adminController.deleteUserById
);
module.exports = router;
