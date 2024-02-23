// userRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userController = require("../controller/userController");

router.get("/register", userController.registerPage);
router.post(
  "/register",
  upload.single("user_image"),
  userController.validateRegister
);
router.get("/register/verify", userController.verifyOTPPage);
router.post("/register/verify", userController.verification);
router.get("/register/resendOTP", userController.resendOTP);
router.get("/login", userController.loginPage);
router.post("/login", userController.loginCredentials);
router.get("/login/forgot-password", userController.forgotPasswordPage);
router.post("/login/forgot-password", userController.sendResetPasswordMail);
router.get("/logout", userController.logout);
router.get("/refresh-captcha", userController.refreshCaptcha);

module.exports = router;
