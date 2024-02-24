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

module.exports = router;
