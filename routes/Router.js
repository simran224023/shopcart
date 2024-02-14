const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
const controller = require("../controller/controllerfunctions");

router.get("/", controller.IndexPage);
router.get("/getCategory/:id", controller.ProductPage);
router.get("/viewmore/:id", controller.ViewMore);
router.get("/search", controller.SearchPage);
router.get("/contactUs", controller.ContactPage);
router.get("/cart", controller.CartPage);
router.get("/register", controller.RegisterPage);
router.get("/refresh-captcha", controller.RefreshCaptcha);
router.post(
  "/register",
  upload.single("user_image"),
  controller.ValidateRegister
);
router.get("/register/verify", controller.VerifyOTPPage);
router.post("/register/verify", controller.Verification);
router.get("/register/resendOTP", controller.ResendOTP);
router.get("/register/email", controller.EmailIntegration);
router.get("/login", controller.LoginPage);
router.post("/login", controller.LoginCredentials);
router.get("/login/forgot-password",controller.ForgotPasswordPage)
router.post("/login/forgot-password",controller.SendResetPasswordMail)
router.get("/logout",controller.Logout);
router.get("/account",controller.verifyToken,controller.ProfilePage)
router.get("/addToCart",controller.AddToCart)
router.post('/updateQuantity', controller.updateQuantity);
router.post('/removeItem', controller.removeItem);
router.post('/getPendingOrders', controller.verifyToken, controller.getPendingOrders);
module.exports = router;
