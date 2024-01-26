const conn = require("../Includes/connection");
const services = require("../controller/Services");
const svgCaptcha = require("svg-captcha");
const session = require("express-session");
const fast2sms = require("fast-two-sms");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");
const cookie = require("cookie-parser");
const { log } = require("console");
const secretKey = "MAiMtInStiTute";
async function IndexPage(req, res) {
  try {
    const categories = await services.getCategories();
    const products = await services.getAllProducts();
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;
    const userId = req.session.userId;
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      // Now you can use `totalAmount` in your render function or wherever needed
      res.render("index", {
        categories,
        products,
        isLoggedIn,
        username,
        totalAmount,
        totalQuantity,
      });
    } else {
      // Handle the case where calculating totalAmount failed
      console.error(
        "Error calculating total amount:",
        totalAmountResult.message
      );
      console.error(
        "Error calculating total amount:",
        totalQuantityResult.message
      );
      res.status(500).send("Internal Server Error");
    }
    // res.render("index", {
    //   categories,
    //   products,
    //   isLoggedIn,
    //   username,
    //   totalAmount,
    // });
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
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;
    const userId = req.session.userId;
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      res.render("getCategoryProducts", {
        categories,
        products,
        isLoggedIn,
        username,
        totalAmount,
        totalQuantity,
      });
    }
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
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;
    const userId = req.session.userId;
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      res.render("viewmore", {
        categories,
        products,
        isLoggedIn,
        username,
        totalAmount,
        totalQuantity,
      });
    }
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
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;
    const userId = req.session.userId;
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      res.render("searchproducts", {
        categories,
        products,
        searchTerm,
        isLoggedIn,
        username,
        totalAmount,
        totalQuantity,
      });
    }
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function ContactPage(req, res) {
  const isLoggedIn = req.session.isLoggedIn;
  const username = req.session.username;
  const userId = req.session.userId;
  const totalAmountResult = await services.CalculateTotalAmount(userId);
  const totalQuantityResult = await services.CalculateTotalQuantity(userId);
  if (totalAmountResult.success && totalQuantityResult.success) {
    const totalAmount = totalAmountResult.totalAmount;
    const totalQuantity = totalQuantityResult.totalQuantity;
    res.render("contactUs", {
      isLoggedIn,
      username,
      totalAmount,
      totalQuantity,
    });
  }
}

async function CartPage(req, res) {
  try {
    const isLoggedIn = req.session.isLoggedIn;
    const username = req.session.username;
    const userId = req.session.userId;

    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const fetchCartItemsResult = await services.FetchCartItems(userId);

    if (
      totalAmountResult.success &&
      totalQuantityResult.success &&
      fetchCartItemsResult.success
    ) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      const cartItems = fetchCartItemsResult.cartItems;

      // Check if the cart is empty
      const noItemMessage = cartItems.length === 0 ? "No Item in Cart" : "";

      res.render("cart", {
        isLoggedIn,
        username,
        totalQuantity,
        totalAmount,
        cartItems,
        noItemMessage,
      });
    } else {
      res.render("cart", {
        isLoggedIn,
        username,
        totalQuantity: 0,
        totalAmount: 0,
        cartItems: [],
        noItemMessage: "No Item in Cart",
      });
    }
  } catch (error) {
    console.error("Error in CartPage:", error);
    // Handle the error
    res.render("cart", {
      isLoggedIn: false,
      username: "",
      totalQuantity: 0,
      totalAmount: 0,
      cartItems: [],
      noItemMessage: "Please Login First",
    });
  }
}


const generateCaptcha = () => {
  const captchaText = svgCaptcha.create();
  return {
    text: captchaText.text,
    data: captchaText.data,
  };
};
async function sendEmail(email, name) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saini.simran3102@gmail.com",
        pass: "fzvjhntiuhkujbxc",
      },
    });

    const mailOptions = {
      from: "saini.simran3102@gmail.com",
      to: email,
      subject: "Shopcart",
      text: `Hi ${name}, You are Successfully Registered in Shopcart`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
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
    user_image: "",
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
    const newCaptcha = await generateCaptcha();
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
      user_image: "",
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
      const newCaptcha = await generateCaptcha();
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
        user_image: "",
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
      try {
        const user_image = req.file.buffer;
        const imagePath = "uploads/" + req.file.originalname;
        const imageName = req.file.originalname;
        fs.writeFileSync(imagePath, user_image);
        req.session.imagePath = imageName;
        return res.redirect("/register/verify");
      } catch (error) {
        console.error("Error handling image upload:", error);
      }
    }
  } catch (error) {
    console.error("Error in ValidateRegister:", error);
  }
}

async function VerifyOTPPage(req, res) {
  return res.render("user/verify_OTP", {
    message: "",
    showAlert: "",
    alertMessage: "",
    redirectUrl: "",
  });
}

function Verification(req, res) {
  const generatedOTP = req.session.OTP;
  console.log("Generated Otp===", generatedOTP);
  const userEnteredOTP = req.body.otp;
  console.log("Entered Otp===", userEnteredOTP);
  if (userEnteredOTP == generatedOTP) {
    res.redirect("/register/email");
  } else {
    return res.render("user/verify_OTP", {
      message: "Incorrect OTP",
      showAlert: "",
      alertMessage: "",
      redirectUrl: "",
    });
  }
}

async function sendOTP(phoneNumber) {
  // const YOUR_API_KEY =
  //   "cP8nX0UDBCruhbbkgWmXQCIedwGciV0vJtmt3Pw3fTLGyLzmpfvn3Ii9VKOc";
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set your options
  // const options = {
  //   authorization: YOUR_API_KEY,
  //   message: `Your OTP is ${otp}`,
  //   numbers: [phoneNumber],
  // };
  // console.log("Options===", options);
  // try {
  // Send SMS
  // const response = await fast2sms.sendMessage(options);
  // console.log("Response from sendMessage:", response);
  // if (response.return === true) {
  console.log("OTP===", otp);
  // console.log("OTP sent successfully!");
  return otp;
  //   } else {
  //     console.error("Failed to send OTP. Error:", response.message);
  //     throw new Error("Failed to send OTP");
  //   }
  // } catch (error) {
  //   console.error("Error sending OTP:", error.message);
  //   throw new Error("Error sending OTP");
  // }
}

async function ResendOTP(req, res) {
  try {
    const user_contact = req.session.userData.user_contact;
    console.log("User Contact===", user_contact);
    const generatedOTP = await sendOTP(user_contact);
    console.log("Resend OTP===", generatedOTP);
    if (generatedOTP !== null) {
      req.session.OTP = generatedOTP;
      return res.redirect("/register/verify");
    } else {
      return res.render("user/verify_OTP", {
        error: "Failed to resend OTP",
        showAlert: "",
        alertMessage: "",
        redirectUrl: "",
      });
    }
  } catch (error) {
    console.error("Error in ResendOTP:", error);
    res.render("user/verify_OTP", {
      message: "Internal Server Error",
      showAlert: "",
      alertMessage: "",
      redirectUrl: "",
    });
  }
}

async function EmailIntegration(req, res) {
  try {
    const userData = req.session.userData;

    const username = userData.user_username;
    const email = userData.user_mail;
    const imagePath = req.session.imagePath;
    const password = userData.user_pass;
    const hashedPassword = await bcrypt.hash(password, 10);
    const address = userData.user_add;
    const contact = userData.user_contact;
    const InsertUserData = await services.InsertUserData(
      username,
      email,
      imagePath,
      hashedPassword,
      address,
      contact
    );

    // Check if the insertion was successful
    if (InsertUserData) {
      // Send a success response
      await sendEmail(email, username);
      res.render("user/verify_OTP", {
        message: "",
        showAlert: true,
        alertMessage: "You are Successfully Registered in Shopcart",
        redirectUrl: "/login", // Redirect URL after the alert
      });
    } else {
      // Handle the case where insertion fails
      // res.status(500).json({
      //   message: "Error inserting user data",
      // });
    }
  } catch (error) {
    console.error("Error in EmailIntegration:", error);
    // res.status(500).json({
    //   message: "Internal Server Error",
    // });
  }
}

async function LoginPage(req, res) {
  let captchaText = generateCaptcha();
  req.session.captchaText = captchaText.text;
  res.render("user/login", {
    email_error: "",
    password_error: "",
    email_value: "",
    password_value: "",
    captchaText: captchaText.data,
    captcha_error: "",
    showAlert: "",
    redirectUrl: "",
    alertMessage: "",
  });
}

async function LoginCredentials(req, res) {
  const { user_email, user_password, captcha } = req.body;
  const enteredCaptcha = captcha || ""; // Ensure enteredCaptcha is not undefined
  const storedCaptcha = req.session.captchaText || "";

  const errors = {
    email: !user_email ? "Email is required" : "",
    password: !user_password ? "Password is required" : "",
    captcha: !enteredCaptcha
      ? "Captcha is required"
      : enteredCaptcha !== storedCaptcha
      ? "Invalid Captcha"
      : "",
  };

  if (errors.email || errors.password || errors.captcha) {
    const newCaptcha = await generateCaptcha();
    req.session.captchaText = newCaptcha.text;

    return res.render("user/login", {
      email_value: user_email,
      password_value: user_password,
      email_error: errors.email,
      password_error: errors.password,
      captcha_error: errors.captcha,
      captchaText: newCaptcha.data,
      showAlert: "",
      redirectUrl: "",
      alertMessage: "",
    });
  }

  const VerifyUser = await services.VerifyEmail(user_email);
  console.log("VerifyUser========", VerifyUser);
  if (VerifyUser && VerifyUser.length > 0) {
    const user = VerifyUser[0];
    const bcryptPassword = await bcrypt.compare(
      user_password,
      user.user_password
    );
    if (bcryptPassword) {
      const userName = user.user_name;
      const userId = user.user_id;
      const expiresInHours = 90;
      const expirationTime = new Date(
        Date.now() + expiresInHours * 60 * 60 * 1000
      ); // Calculate expiration time
      const token = jwt.sign({ user_email }, secretKey, {
        expiresIn: `${expiresInHours}h`,
      });
      res.cookie("token", token, {
        httpOnly: true,
        expires: expirationTime, // Set the expiration time
        // Other cookie options if needed
      });
      req.session.isLoggedIn = true;
      req.session.username = userName;
      req.session.userId = userId;
      const isLoggedIn = req.session.isLoggedIn;
      const username = req.session.username;
      return res.render("user/login", {
        showAlert: "true",
        redirectUrl: "/",
        alertMessage: `You are Successfully LoggedIn`,
        email_value: "",
        password_value: "",
        email_error: "",
        password_error: "",
        captcha_error: "",
        captchaText: "",
      });
    } else {
      const newCaptcha = await generateCaptcha();
      req.session.captchaText = newCaptcha.text;

      return res.render("user/login", {
        email_value: user_email,
        password_value: user_password,
        email_error: errors.email,
        password_error: "Incorrect Password",
        captcha_error: errors.captcha,
        captchaText: newCaptcha.data,
        showAlert: "",
        redirectUrl: "",
        alertMessage: "",
      });
    }
  } else {
    const newCaptcha = await generateCaptcha();
    req.session.captchaText = newCaptcha.text;

    return res.render("user/login", {
      email_value: user_email,
      password_value: user_password,
      email_error: "Email not found",
      password_error: errors.password,
      captcha_error: errors.captcha,
      captchaText: newCaptcha.data,
      showAlert: "",
      redirectUrl: "",
      alertMessage: "",
    });
  }
}

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  const decoded = jwt.verify(token, secretKey, (err, authData) => {
    if (err) {
      res.redirect("/login");
    }
    next();
  });
};

async function ForgotPasswordPage(req, res) {
  res.render("user/forgot", {
    mail_error: "",
    userEmail: "",
  });
}

async function SendResetPasswordMail(req, res) {
  const userEmail = req.body.user_email;

  if (!userEmail) {
    return res.render("user/forgot", {
      mail_error: "Email is required",
      userEmail,
    });
  }
  const VerifyUser = await services.VerifyEmail(userEmail);
  console.log("VerifyUser===", VerifyUser);
  if (VerifyUser.length === 0) {
    return res.render("user/forgot", {
      mail_error: "Email is not valid",
      userEmail,
    });
  }
}

async function Logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.clearCookie("token");
    res.redirect("/");
  });
}

async function ProfilePage(req, res) {
  const isLoggedIn = req.session.isLoggedIn;
  const username = req.session.username;
  res.render("user/myprofile", { isLoggedIn, username });
}

async function AddToCart(req, res) {
  const productId = req.query.product_id;
  const userId = req.session.userId;
  console.log("User_Id===", userId);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Please Login First",
    });
  }

  try {
    console.log("Adding to cart:", productId, userId);
    const added = await services.AddCart(productId, userId);
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    const totalAmount = totalAmountResult.totalAmount;
    const totalQuantity = totalQuantityResult.totalQuantity;
    console.log("Added to cart result:", added);
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      totalQuantity,
      totalAmount,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Update quantity controller
async function updateQuantity(req, res) {
  const { productId, newQuantity } = req.body;
  const userId = req.session.userId;

  try {
    // Update quantity in the database
    await conn.query(
      "UPDATE cart_details SET quantity = ? WHERE product_id = ? AND user_id = ?",
      [newQuantity, productId, userId]
    );

    // Calculate total amount and quantity after the update
    const { totalAmount, totalQuantity } = await recalculateTotals(userId);

    res.json({
      success: true,
      message: "Quantity updated successfully",
      totalAmount,
      totalQuantity,
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Remove item controller
async function removeItem(req, res) {
  const { productId } = req.body;
  const userId = req.session.userId;

  try {
    // Remove item from the database
    await conn.query(
      "DELETE FROM cart_details WHERE product_id = ? AND user_id = ?",
      [productId, userId]
    );

    // Calculate total amount and quantity after the removal
    const { totalAmount, totalQuantity } = await recalculateTotals(userId);
    let message = "Item removed successfully";
    let noItemMessage = ""; // Initialize noItemMessage variable

    if (totalQuantity == 0) {
      noItemMessage = "No items in the cart";
      message; // Assign message to noItemMessage if totalQuantity is zero
    }

    res.json({
      success: true,
      message,
      totalAmount,
      totalQuantity,
      noItemMessage,
    });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Helper function to recalculate total amount and quantity
async function recalculateTotals(userId) {
  const totalAmountResult = await services.CalculateTotalAmount(userId);
  const totalQuantityResult = await services.CalculateTotalQuantity(userId);

  return {
    totalAmount: totalAmountResult.totalAmount,
    totalQuantity: totalQuantityResult.totalQuantity,
  };
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
  EmailIntegration,
  LoginPage,
  LoginCredentials,
  verifyToken,
  ForgotPasswordPage,
  SendResetPasswordMail,
  Logout,
  ProfilePage,
  AddToCart,
  updateQuantity,
  removeItem,
};
