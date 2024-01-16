const conn = require("../Includes/connection");
const services = require("../controller/Services");
const svgCaptcha = require("svg-captcha");
const session = require("express-session");
const axios = require("axios");
const fast2sms = require("fast-two-sms");

async function IndexPage(req, res) {
  try {
    const categories = await services.getCategories();
    const products = await services.getAllProducts();
    res.render("index", { categories, products });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function ProductPage(req, res) {
  try {
    const categoryId = req.params.id;
    const categories = await services.getCategories();
    const products = await services.getProductsByCategoryId(categoryId);
    res.render("getCategoryProducts", { categories, products });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function ViewMore(req, res) {
  try {
    const productId = req.params.id;
    const categories = await services.getCategories();
    const products = await services.getProductsByProductId(productId);
    res.render("viewmore", { categories, products });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function SearchPage(req, res) {
  try {
    const searchTerm = req.query.q;
    const categories = await services.getCategories();
    const products = await services.getProductsBySearchTerm(searchTerm);
    res.render("searchproducts", { categories, products, searchTerm });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

function ContactPage(req, res) {
  res.render("contactUs");
}

function CartPage(req, res) {
  res.render("cart");
}

const generateCaptcha = () => {
  const captchaText = svgCaptcha.create();
  return {
    text: captchaText.text,
    data: captchaText.data,
  };
};
function RefreshCaptcha(req, res) {
  const newCaptcha = generateCaptcha();
  req.session.captchaText = newCaptcha.text;

  // Send the new captcha as JSON
  res.json({ captchaText: newCaptcha.data });
}

function RegisterPage(req, res) {
  let captchaText = generateCaptcha();
  req.session.captchaText = captchaText.text;
  res.render("user/user_register", {
    username_error: "",
    usermail_error: "",
    image_error: "",
    pass_error: "",
    conf_pass_error: "",
    add_error: "",
    contact_error: "",
    captcha_error: "",
    user_username: "",
    user_mail: "",
    user_pass: "",
    conf_user_pass: "",
    user_add: "",
    user_contact: "",
    captcha: "",
    captchaText: captchaText.data,
    message: "",
  });
}

async function ValidateRegister(req, res, next) {
  const {
    user_username,
    user_mail,
    user_pass,
    conf_user_pass,
    user_add,
    user_contact,
    captcha,
  } = req.body;
  const allowedFormats = ["image/png", "image/jpeg"];
  const enteredCaptcha = req.body.captcha;
  const storedCaptcha = req.session.captchaText;

  // Set error messages based on validation results
  const username_error = !user_username
    ? "Username is required"
    : /^[A-Z][a-zA-Z\s]+$/.test(user_username)
    ? ""
    : "Username must start with a capital letter and contain only letters";
  const usermail_error = !user_mail
    ? "Email is required"
    : /^\S+@\S+\.\S+$/.test(user_mail)
    ? ""
    : "Invalid email format";
  const image_error = req.file
    ? allowedFormats.includes(req.file.mimetype) &&
      req.file.size <= 5 * 1024 * 1024
      ? ""
      : "Invalid image format or size (max 5MB, PNG or JPEG only)"
    : "User Image is required";
  const pass_error = !user_pass
    ? "Password is required"
    : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])/.test(user_pass)
    ? ""
    : "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character";
  const conf_pass_error = !conf_user_pass
    ? "Confirm Password is required"
    : user_pass === conf_user_pass
    ? ""
    : "Passwords do not match";

  const add_error =
    !user_add || user_add.trim() === "" ? "Address is required" : "";

  const contact_error = !user_contact
    ? "Contact is required"
    : /^(\+91)?[6-9]\d{9}$/.test(user_contact)
    ? ""
    : "Invalid Contact number";

  const captcha_error = !enteredCaptcha
    ? "Captcha is required"
    : enteredCaptcha !== storedCaptcha
    ? "Invalid Captcha"
    : "";

  if (
    captcha_error ||
    username_error ||
    usermail_error ||
    image_error ||
    pass_error ||
    conf_pass_error ||
    add_error ||
    contact_error
  ) {
    // If captcha is required or invalid, generate a new captcha
    const newCaptcha = generateCaptcha();
    req.session.captchaText = newCaptcha.text;
    return res.render("user/user_register", {
      username_error,
      usermail_error,
      image_error,
      pass_error,
      conf_pass_error,
      add_error,
      contact_error,
      user_username,
      user_mail,
      user_pass,
      conf_user_pass,
      user_add,
      user_contact,
      captcha,
      message: "",
      captcha_error,
      captchaText: newCaptcha.data,
    });
  }
  try {
    const verifyData = await services.VerifyData(user_mail, user_contact);
    console.log("Verify======", verifyData);
    if (verifyData.length > 0) {
      const message = "You are already Registered";
      const newCaptcha = generateCaptcha();
      req.session.captchaText = newCaptcha.text;
      return res.render("user/user_register", {
        username_error,
        usermail_error,
        image_error,
        pass_error,
        conf_pass_error,
        add_error,
        contact_error,
        captcha,
        captcha_error,
        user_username,
        user_mail,
        user_pass,
        conf_user_pass,
        user_add,
        user_contact,
        captchaText: newCaptcha.data,
        message,
      });
    } else {
      req.session.userData = {
        user_username,
        user_mail,
        user_pass,
        conf_user_pass,
        user_add,
        user_contact,
      };
      const generatedOTP = await sendOTP(user_contact);
      if (generatedOTP !== null) {
        req.session.OTP = generatedOTP;
      }
      return res.redirect("/register/verify");
    }
  } catch (error) {
    console.error("Error in ValidateRegister:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An error occurred while processing your request.",
    });
  }
}

async function VerifyOTPPage(req, res) {
  return res.render("user/verify_OTP");
}

function Verification(req, res) {
  const generatedOTP = req.session.OTP;
  const userEnteredOTP = req.body.otp;
  if (userEnteredOTP == generatedOTP) {
    res.send("OTP is correct");
  } else {
    res.send("Incorrect OTP");
  }
}

async function sendOTP(phoneNumber) {
  const YOUR_API_KEY =
    "cP8nX0UDBCruhbbkgWmXQCIedwGciV0vJtmt3Pw3fTLGyLzmpfvn3Ii9VKOc";
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set your options
  const options = {
    authorization: YOUR_API_KEY,
    message: `Your OTP is ${otp}`,
    numbers: [phoneNumber],
  };
  console.log("Options===", options);
  try {
    // Send SMS
    // const response = await fast2sms.sendMessage(options);
    // console.log("Response from sendMessage:", response);
    // if (response.return === true) {
    //   console.log("OTP sent successfully!");
      return otp;
  //   } else {
  //     console.error("Failed to send OTP. Error:", response.message);
  //     throw new Error("Failed to send OTP");
  //   }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Error sending OTP");
  }
}


async function ResendOTP(req, res) {
  try {
    const  user_contact  = req.session.userData.user_contact;
    const generatedOTP = await sendOTP(user_contact);
    if (generatedOTP !== null) {
      req.session.OTP = generatedOTP;
      return res.redirect("/register/verify");
    } else {
      return res.render("user/verify_OTP", { error: "Failed to resend OTP" });
    }
  } catch (error) {
    console.error("Error in ResendOTP:", error);
    res.render("user/verify_OTP", { error: "Internal Server Error" });
  }
}

module.exports = {
  IndexPage,
  ProductPage,
  ViewMore,
  SearchPage,
  ContactPage,
  CartPage,
  RegisterPage,
  ValidateRegister,
  generateCaptcha,
  RefreshCaptcha,
  VerifyOTPPage,
  Verification,
  ResendOTP,
};
