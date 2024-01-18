const express = require("express");
const router = express.Router();
const multer = require("multer");
// const multer = multer({ dest: "uploads/" });
const controller = require("../controller/controllerfunctions");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

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
  controller.ValidateRegister,
);
router.get("/register/verify", controller.VerifyOTPPage)
router.post("/register/verify", controller.Verification)
router.get("/register/resendOTP", controller.ResendOTP)
router.get("/register/email", controller.EmailIntegration)
router.get('/login', controller.LoginPage)

module.exports = router;
