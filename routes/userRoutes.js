// userRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userController = require("../controller/userController");

router.get("/register", userController.RegisterPage);
router.post(
  "/register",
  upload.single("user_image"),
  userController.ValidateRegister
);
router.get("/register/verify", userController.VerifyOTPPage);
router.post("/register/verify", userController.Verification);
router.get("/register/resendOTP", userController.ResendOTP);
router.get("/login", userController.LoginPage);
router.post("/login", userController.LoginCredentials);
router.get("/login/forgot-password", userController.ForgotPasswordPage);
router.post("/login/forgot-password", userController.SendResetPasswordMail);
router.get("/logout", userController.Logout);
router.get("/refresh-captcha", userController.RefreshCaptcha);

module.exports = router;
