const fast2sms = require("fast-two-sms");
const nodemailer = require("nodemailer");
const svgCaptcha = require("svg-captcha");
const bcrypt = require("bcrypt");
const services = require("../servicesFiles/services");
const axios = require("axios");
const qs = require("qs");
async function generateCaptcha() {
  const captchaText = await svgCaptcha.create();
  return {
    text: captchaText.text,
    data: captchaText.data,
  };
}

async function validation(payload) {
  const user_username = payload.user_username;
  const user_mail = payload.user_mail;
  const user_pass = payload.user_pass;
  const conf_user_pass = payload.conf_user_pass;
  const user_add = payload.user_add;
  const user_contact = payload.user_contact;
  const enteredCaptcha = payload.enteredCaptcha;
  const storedCaptcha = payload.storedCaptcha;
  const allowedFormats = payload.allowedFormats;
  const userImage = payload.userImage;

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
  const image_error = userImage
    ? allowedFormats.includes(userImage.mimetype) &&
      userImage.size <= 5 * 1024 * 1024
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
  return {
    username_error,
    usermail_error,
    image_error,
    pass_error,
    conf_pass_error,
    add_error,
    contact_error,
    captcha_error,
  };
}

// async function sendOTP(phoneNumber) {
//   const YOUR_API_KEY =
//     // "cP8nX0UDBCruhbbkgWmXQCIedwGciV0vJtmt3Pw3fTLGyLzmpfvn3Ii9VKOc";
//     "2di4uRQxZfHpNgjXteE8Or3bBlVFYmDG7AWTnhwo019zCvMy6Si1fZgs0VCIjBQoLuldP8WYatrc9HxG";
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   // Set your options
//   const options = {
//     authorization: YOUR_API_KEY,
//     message: `Your OTP is ${otp}`,
//     numbers: [phoneNumber],
//   };
//   console.log("Options===", options);
//   try {
//     //   Send SMS
//     const response = await fast2sms.sendMessage(options);
//     console.log("Response from sendMessage:", response);
//     if (response.return === true) {
//       console.log("OTP===", otp);
//       console.log("OTP sent successfully!");
//       return otp;
//     } else {
//       console.error("Failed to send OTP. Error:", response.message);
//       throw new Error("Failed to send OTP");
//     }
//   } catch (error) {
//     console.error("Error sending OTP:", error.message);
//     throw new Error("Error sending OTP");
//   }
// }
async function sendOTP(phoneNumber) {
  try {
    const YOUR_API_KEY =
      // "cP8nX0UDBCruhbbkgWmXQCIedwGciV0vJtmt3Pw3fTLGyLzmpfvn3Ii9VKOc";
      "2di4uRQxZfHpNgjXteE8Or3bBlVFYmDG7AWTnhwo019zCvMy6Si1fZgs0VCIjBQoLuldP8WYatrc9HxG";
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const data = qs.stringify({
      variables_values: otp,
      route: "otp",
      numbers: phoneNumber, // Replace with actual phone numbers
    });
    console.log("Options===", data);
    const config = {
      method: "post",
      url: "https://www.fast2sms.com/dev/bulkV2",
      headers: {
        authorization: YOUR_API_KEY,
        "Content-Type":"application/json"
      },
      data: data,
    };

    const response = await axios(config);
    console.log("Response:", response.data);
    if (response.data.return === true) {
      console.log("OTP===", otp);
      console.log("OTP sent successfully!");
      return otp;
    } else {
      console.error("Failed to send OTP. Error:", response.data.message);
      throw new Error("Failed to send OTP");
    }
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error sending OTP");
  }
}

// sendOTP(7015585404)
async function sendEmail(email, name) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "simransaini.224027@gmail.com",
        pass: "tkpayztlbkssvmyc",
      },
    });

    const mailOptions = {
      from: "simransaini.224027@gmail.com",
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
async function emailIntegration(userData, imagePath) {
  try {
    const { user_username, user_mail, user_pass, user_add, user_contact } =
      userData;

    const hashedPassword = await bcrypt.hash(user_pass, 10);

    const InsertUserData = await services.insertUserData(
      user_username,
      user_mail,
      imagePath,
      hashedPassword,
      user_add,
      user_contact
    );

    if (InsertUserData) {
      await sendEmail(user_mail, user_username);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error in EmailIntegration:", error);
    // Log more details or provide a specific error message if needed
    return false;
  }
}

async function validateLoginCredentials(
  user_email,
  user_password,
  enteredCaptcha,
  storedCaptcha
) {
  const errors = {
    email: !user_email ? "Email is required" : "",
    password: !user_password ? "Password is required" : "",
    captcha: !enteredCaptcha
      ? "Captcha is required"
      : enteredCaptcha !== storedCaptcha
      ? "Invalid Captcha"
      : "",
  };

  return errors;
}

async function recalculateTotals(userId) {
  const totalAmountResult = await services.calculateTotalAmount(userId);
  const totalQuantityResult = await services.calculateTotalQuantity(userId);

  return {
    totalAmount: totalAmountResult.totalAmount,
    totalQuantity: totalQuantityResult.totalQuantity,
  };
}

async function updateValidate(payload) {
  const allowedFormats = ["image/png", "image/jpeg"];
  const user_username = payload.user_name;
  const user_mail = payload.user_email;
  const user_add = payload.user_address;
  const user_contact = payload.user_mobile;
  const userImage = payload.user_image;
  let image_error;
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
  if (userImage) {
    image_error =
      allowedFormats.includes(userImage.mimetype) &&
      userImage.size <= 5 * 1024 * 1024
        ? ""
        : "Invalid image format or size (max 5MB, PNG or JPEG only)";
  } else image_error = "";
  const add_error =
    !user_add || user_add.trim() === "" ? "Address is required" : "";

  const contact_error = !user_contact
    ? "Contact is required"
    : /^(\+91)?[6-9]\d{9}$/.test(user_contact)
    ? ""
    : "Invalid Contact number";
  return {
    username_error,
    usermail_error,
    image_error,
    add_error,
    contact_error,
  };
}

async function sendForgotPasswordMail(user_email, user_id) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "simransaini.224027@gmail.com",
        pass: "tkpayztlbkssvmyc",
      },
    });

    const mailOptions = {
      from: "simransaini.224027@gmail.com",
      to: user_email,
      subject: "Shopcart Reset Password",
      html: `<p style="font-size:20px">Click the following link to reset your Shopcart password:</p>
           <a href="http://localhost:3306/login/reset-password?userId=${user_id}">Reset Password</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { ok: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      ok: false,
      message: "Error sending email. Please try again later.",
    };
  }
}

async function validatePassword(password, confirmPassword) {
  const pass_error = !password
    ? "Password is required"
    : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])/.test(password)
    ? ""
    : "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character";
  const conf_pass_error = !confirmPassword
    ? "Confirm Password is required"
    : password === confirmPassword
    ? ""
    : "Passwords do not match";

  return {
    pass_error,
    conf_pass_error,
  };
}

async function updatePassword(password, userId) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatePassword = await services.updatePassword(hashedPassword, userId);
  console.log("update=====", updatePassword);
  if (updatePassword.success) {
    return { success: true };
  }
}

async function adminRegisterValidate(payload) {
  const adminName = payload.adminName;
  const adminEmail = payload.adminEmail;
  const adminPassword = payload.adminPassword;
  const confAdminPassword = payload.adminConfPassword;
  const enteredCaptcha = payload.enteredCaptcha;
  const storedCaptcha = payload.storedCaptcha;
  const allowedFormats = payload.allowedFormats;
  const adminImage = payload.adminImage;
  const adminNameError = !adminName
    ? "Username is required"
    : /^[A-Z][a-zA-Z\s]+$/.test(adminName)
    ? ""
    : "Username must start with a capital letter and contain only letters";
  const adminEmailError = !adminEmail
    ? "Email is required"
    : /^\S+@\S+\.\S+$/.test(adminEmail)
    ? ""
    : "Invalid email format";
  const adminImageError = adminImage
    ? allowedFormats.includes(adminImage.mimetype) &&
      adminImage.size <= 5 * 1024 * 1024
      ? ""
      : "Invalid image format or size (max 5MB, PNG or JPEG only)"
    : "User Image is required";
  const adminPasswordError = !adminPassword
    ? "Password is required"
    : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])/.test(adminPassword)
    ? ""
    : "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character";
  const adminConfPasswordError = !confAdminPassword
    ? "Confirm Password is required"
    : adminPassword === confAdminPassword
    ? ""
    : "Passwords do not match";
  const captcha_error = !enteredCaptcha
    ? "Captcha is required"
    : enteredCaptcha !== storedCaptcha
    ? "Invalid Captcha"
    : "";
  return {
    adminNameError,
    adminEmailError,
    adminPasswordError,
    adminImageError,
    adminConfPasswordError,
    captcha_error,
  };
}

async function validateAdminLoginCredentials(
  adminEmail,
  adminPassword,
  enteredCaptcha,
  storedCaptcha
) {
  const adminLoginErrors = {
    email: !adminEmail ? "Email is required" : "",
    password: !adminPassword ? "Password is required" : "",
    captcha: !enteredCaptcha
      ? "Captcha is required"
      : enteredCaptcha !== storedCaptcha
      ? "Invalid Captcha"
      : "",
  };

  return adminLoginErrors;
}

async function validateInsertProducts(payload) {
  const {
    product_title,
    product_description,
    product_keywords,
    product_category,
    product_price,
    bestseller,
    product_image1,
    product_image2,
    product_image3,
  } = payload;

  // Validation for text fields
  const product_title_error = !product_title ? "Product Title is required" : "";
  const product_description_error = !product_description
    ? "Product Description is required"
    : "";
  const product_keywords_error = !product_keywords
    ? "Product Keywords are required"
    : "";
  const product_price_error = !product_price
    ? "Product Price is required"
    : !/^\d+$/.test(product_price)
    ? "Price must be a positive integer"
    : "";

  // Validation for select list
  const product_category_error = !product_category
    ? "Product Category is required"
    : "";

  // Validation for image fields
  const validateImage = (image, fieldName) => {
    return image
      ? image.size <= 5 * 1024 * 1024
        ? ["image/jpeg", "image/png"].includes(image.mimetype)
          ? ""
          : `Invalid format for ${fieldName}. Only PNG or JPEG allowed`
        : `Size of ${fieldName} exceeds the maximum allowed size (5MB)`
      : `${fieldName} is required`;
  };

  const product_image1_error = validateImage(product_image1, "Product Image 1");
  const product_image2_error = validateImage(product_image2, "Product Image 2");
  const product_image3_error = validateImage(product_image3, "Product Image 3");

  // Validation for radio button
  const bestseller_error = !bestseller ? "Bestseller is required" : "";

  return {
    product_title_error,
    product_description_error,
    product_keywords_error,
    product_category_error,
    product_price_error,
    product_image1_error,
    product_image2_error,
    product_image3_error,
    bestseller_error,
  };
}

async function validateEditProducts(payload) {
  const {
    product_title,
    product_description,
    product_keywords,
    product_category,
    product_price,
    bestseller,
    product_image1,
    product_image2,
    product_image3,
  } = payload;

  // Validation for text fields
  const product_title_error = !product_title ? "Product Title is required" : "";
  const product_description_error = !product_description
    ? "Product Description is required"
    : "";
  const product_keywords_error = !product_keywords
    ? "Product Keywords are required"
    : "";
  const product_price_error = !product_price
    ? "Product Price is required"
    : !/^\d+$/.test(product_price)
    ? "Price must be a positive integer"
    : "";

  // Validation for select list
  const product_category_error = !product_category
    ? "Product Category is required"
    : "";

  // Validation for image fields
  const validateImage = (image, fieldName) => {
    return image
      ? image.size <= 5 * 1024 * 1024
        ? ["image/jpeg", "image/png"].includes(image.mimetype)
          ? ""
          : `Invalid format for ${fieldName}. Only PNG or JPEG allowed`
        : `Size of ${fieldName} exceeds the maximum allowed size (5MB)`
      : "";
  };

  const product_image1_error = validateImage(product_image1, "Product Image 1");
  const product_image2_error = validateImage(product_image2, "Product Image 2");
  const product_image3_error = validateImage(product_image3, "Product Image 3");

  // Validation for radio button
  const bestseller_error = !bestseller ? "Bestseller is required" : "";

  return {
    product_title_error,
    product_description_error,
    product_keywords_error,
    product_category_error,
    product_price_error,
    product_image1_error,
    product_image2_error,
    product_image3_error,
    bestseller_error,
  };
}
module.exports = {
  generateCaptcha,
  validation,
  sendOTP,
  sendEmail,
  emailIntegration,
  validateLoginCredentials,
  recalculateTotals,
  updateValidate,
  sendForgotPasswordMail,
  validatePassword,
  updatePassword,
  adminRegisterValidate,
  validateAdminLoginCredentials,
  validateInsertProducts,
  validateEditProducts,
};
