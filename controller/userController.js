const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cookie = require("cookie-parser");
const secretKey = "MAiMtInStiTute";
const helper = require("../helperFiles/helper");
const services = require("../servicesFiles/services");

async function registerPage(req, res) {
  let captchaText = await helper.generateCaptcha();
  req.session.captchaText = captchaText.text;
  return res.render("user/userRegister", {
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

async function validateRegister(req, res, next) {
  try {
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
    const payload = {
      user_username,
      user_mail,
      user_pass,
      conf_user_pass,
      user_add,
      user_contact,
      enteredCaptcha,
      storedCaptcha,
      allowedFormats,
      userImage: req.file,
    };
    const validation = await helper.validation(payload);

    const {
      captcha_error,
      username_error,
      usermail_error,
      image_error,
      pass_error,
      conf_pass_error,
      add_error,
      contact_error,
    } = validation;

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
      const newCaptcha = await helper.generateCaptcha();
      req.session.captchaText = newCaptcha.text;
      return res.render("user/userRegister", {
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

    const verifyData = await services.verifyData(user_mail, user_contact);
    console.log("Verify======", verifyData);

    if (verifyData.length > 0) {
      const message = "You are already Registered";
      const newCaptcha = await helper.generateCaptcha();
      req.session.captchaText = newCaptcha.text;
      return res.render("user/userRegister", {
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
      const generatedOTP = await helper.sendOTP(user_contact);
      if (generatedOTP !== null) {
        req.session.OTP = generatedOTP;
      }
      try {
        const user_image = req.file.buffer;
        const imagePath = "uploads/" + req.file.originalname;
        const imageName = req.file.originalname;
        fs.writeFileSync(imagePath, user_image);
        req.session.imagePath = imageName;
        return res.redirect("/register/verify"); //verification
      } catch (error) {
        console.error("Error handling image upload:", error);
      }
    }
  } catch (error) {
    console.error("An unexpected error occurred in ValidateRegister:", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function verifyOTPPage(req, res) {
  return res.render("user/verifyOTP", {
    message: "",
    showAlert: "",
    alertMessage: "",
    redirectUrl: "",
  });
}

async function verification(req, res) {
  const generatedOTP = req.session.OTP;
  console.log("Generated Otp ===", generatedOTP);
  const userEnteredOTP = req.body.otp;
  console.log("Entered Otp ===", userEnteredOTP);

  if (userEnteredOTP == generatedOTP) {
    const userData = req.session.userData;
    const imagePath = req.session.imagePath;

    try {
      const emailIntegrationSuccess = await helper.emailIntegration(
        userData,
        imagePath
      );

      if (emailIntegrationSuccess) {
        res.render("user/verifyOTP", {
          message: "",
          showAlert: true,
          alertMessage: "You are Successfully Registered in Shopcart",
          redirectUrl: "/login",
        });
      } else {
        return res.render("user/verifyOTP", {
          message: "Registration failed. Please try again.",
          showAlert: true,
          alertMessage: "Registration Failed",
          redirectUrl: "/register",
        });
      }
    } catch (error) {
      console.error("Error during EmailIntegration:", error);
    }
  } else {
    return res.render("user/verifyOTP", {
      message: "Incorrect OTP",
      showAlert: "",
      alertMessage: "",
      redirectUrl: "",
    });
  }
}

async function resendOTP(req, res) {
  try {
    const user_contact = req.session.userData.user_contact;
    console.log("User Contact===", user_contact);
    const generatedOTP = await helper.sendOTP(user_contact);
    console.log("Resend OTP===", generatedOTP);
    if (generatedOTP !== null) {
      req.session.OTP = generatedOTP;
      return res.redirect("/register/verify");
    } else {
      return res.render("user/verifyOTP", {
        error: "Failed to resend OTP",
        showAlert: "",
        alertMessage: "",
        redirectUrl: "",
      });
    }
  } catch (error) {
    console.error("Error in ResendOTP:", error);
    res.render("user/verifyOTP", {
      message: "Internal Server Error",
      showAlert: "",
      alertMessage: "",
      redirectUrl: "",
    });
  }
}

async function loginPage(req, res) {
  let captchaText = await helper.generateCaptcha();
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

async function loginCredentials(req, res) {
  try {
    const { user_email, user_password, captcha } = req.body;
    const enteredCaptcha = captcha || "";
    const storedCaptcha = req.session.captchaText || "";

    const errors = await helper.validateLoginCredentials(
      user_email,
      user_password,
      enteredCaptcha,
      storedCaptcha
    );

    if (errors.email || errors.password || errors.captcha) {
      const newCaptcha = await helper.generateCaptcha();
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

    const VerifyUser = await services.verifyEmail(user_email);

    if (VerifyUser && VerifyUser.length > 0) {
      const user = VerifyUser[0];
      const bcryptPassword = await bcrypt.compare(
        user_password,
        user.user_password
      );

      if (bcryptPassword) {
        const userId = user.user_id;
        const expiresInHours = 90;
        const expirationTime = new Date(
          Date.now() + expiresInHours * 60 * 60 * 1000
        );
        const token = jwt.sign({ user_email }, secretKey, {
          expiresIn: `${expiresInHours}h`,
        });

        res.cookie("token", token, {
          httpOnly: true,
          expires: expirationTime,
        });

        res.cookie("userId", userId, {
          expires: expirationTime,
          httpOnly: true,
        });

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
        const newCaptcha = await helper.generateCaptcha();
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
      const newCaptcha = await helper.generateCaptcha();
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
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send("Internal Server Error");
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

async function refreshCaptcha(req, res) {
  const newCaptcha = await helper.generateCaptcha();
  req.session.captchaText = newCaptcha.text;
  res.json({ captchaText: newCaptcha.data });
}

async function forgotPasswordPage(req, res) {
  res.render("user/forgot", {
    mail_error: "",
    userEmail: "",
  });
}

async function sendResetPasswordMail(req, res) {
  const userEmail = req.body.user_email;

  if (!userEmail) {
    return res.render("user/forgot", {
      mail_error: "Email is required",
      userEmail,
    });
  }
  const VerifyUser = await services.verifyEmail(userEmail);
  console.log("VerifyUser===", VerifyUser);
  if (VerifyUser.length === 0) {
    return res.render("user/forgot", {
      mail_error: "Email is not valid",
      userEmail,
    });
  }
  const userId = VerifyUser[0].user_id;
  const sendForgotPasswordMail = await helper.sendForgotPasswordMail(
    userEmail,
    userId
  );
  if (sendForgotPasswordMail.ok) {
    return res.redirect("/login/forgot-password");
  }
}

async function resetPasswordPage(req, res) {
  return res.render("user/resetPassword", {
    pass_error: "",
    conf_pass_error: "",
    password: "",
    confPassword: "",
    alert: "",
  });
}

async function updatePassword(req, res) {
  const userId = req.query.userId;
  const password = req.body.user_password;
  const confPassword = req.body.conf_user_pass;
  const validatePassword = await helper.validatePassword(
    password,
    confPassword
  );
  const pass_error = validatePassword.pass_error;
  const conf_pass_error = validatePassword.conf_pass_error;
  if (pass_error || conf_pass_error) {
    return res.render("user/resetPassword", {
      pass_error,
      conf_pass_error,
      password,
      confPassword,
      alert: "",
    });
  }
  const updatePassword = await helper.updatePassword(password, userId);
  if (updatePassword.success) {
    return res.render("user/resetPassword", {
      pass_error:"",
      conf_pass_error:"",
      password,
      confPassword,
      alert: "Yes",
    });
  } else {
    return res.render("user/resetPassword", {
      pass_error:"",
      conf_pass_error:"",
      password,
      confPassword,
      alert: "No",
    });
  }
}

async function logout(req, res) {
  res.clearCookie("token");
  res.clearCookie("userId");
  res.redirect("/");
}

module.exports = {
  verifyOTPPage,
  verification,
  resendOTP,
  loginPage,
  loginCredentials,
  verifyToken,
  registerPage,
  validateRegister,
  refreshCaptcha,
  forgotPasswordPage,
  sendResetPasswordMail,
  logout,
  resetPasswordPage,
  updatePassword,
};
