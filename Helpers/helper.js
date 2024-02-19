const fast2sms = require("fast-two-sms");
const nodemailer = require("nodemailer");
const svgCaptcha = require("svg-captcha");
const bcrypt = require("bcrypt");
const services = require("../DBservices/services");

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
    //   Send SMS
    const response = await fast2sms.sendMessage(options);
    console.log("Response from sendMessage:", response);
    if (response.return === true) {
      console.log("OTP===", otp);
      console.log("OTP sent successfully!");
      return otp;
    } else {
      console.error("Failed to send OTP. Error:", response.message);
      throw new Error("Failed to send OTP");
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Error sending OTP");
  }
}

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

async function EmailIntegration(userData, imagePath) {
  try {
    const { user_username, user_mail, user_pass, user_add, user_contact } =
      userData;

    const hashedPassword = await bcrypt.hash(user_pass, 10);

    const InsertUserData = await services.InsertUserData(
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
  const totalAmountResult = await services.CalculateTotalAmount(userId);
  const totalQuantityResult = await services.CalculateTotalQuantity(userId);

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
module.exports = {
  generateCaptcha,
  validation,
  sendOTP,
  sendEmail,
  EmailIntegration,
  validateLoginCredentials,
  recalculateTotals,
  updateValidate,
};
