const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cookie = require("cookie-parser");
const secretKey = "MAiMtInStiTute";
const helper = require("../helperFiles/helper");
const services = require("../servicesFiles/services");
const { Console } = require("console");

async function registerPage(req, res) {
  try {
    let captchaText = await helper.generateCaptcha();
    req.session.captchaText = captchaText.text;
    return res.render("admin/adminRegister", {
      captcha_error: "",
      adminNameError: "",
      adminEmailError: "",
      adminPasswordError: "",
      adminImageError: "",
      adminConfPasswordError: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      adminConfPassword: "",
      message: "",
      captchaText: captchaText.data,
      alert: "",
    });
  } catch (error) {
    console.error("Error in registerPage:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function validateRegister(req, res) {
  try {
    const { adminName, adminEmail, adminPassword, adminConfPassword, captcha } =
      req.body;
    const allowedFormats = ["image/png", "image/jpeg"];
    const enteredCaptcha = req.body.captcha;
    const storedCaptcha = req.session.captchaText;
    const payload = {
      adminName,
      adminEmail,
      adminPassword,
      adminConfPassword,
      enteredCaptcha,
      storedCaptcha,
      allowedFormats,
      adminImage: req.file,
    };

    let captcha_error,
      adminNameError,
      adminEmailError,
      adminPasswordError,
      adminImageError,
      adminConfPasswordError;
    // Validation
    try {
      const validation = await helper.adminRegisterValidate(payload);

      captcha_error = validation.captcha_error;
      adminNameError = validation.adminNameError;
      adminEmailError = validation.adminEmailError;
      adminPasswordError = validation.adminPasswordError;
      adminImageError = validation.adminImageError;
      adminConfPasswordError = validation.adminConfPasswordError;

      if (
        captcha_error ||
        adminNameError ||
        adminEmailError ||
        adminPasswordError ||
        adminImageError ||
        adminConfPasswordError
      ) {
        const newCaptcha = await helper.generateCaptcha();
        req.session.captchaText = newCaptcha.text;
        return res.render("admin/adminRegister", {
          captcha_error,
          adminNameError,
          adminEmailError,
          adminPasswordError,
          adminImageError,
          adminConfPasswordError,
          adminName,
          adminEmail,
          adminPassword,
          adminConfPassword,
          message: "",
          captchaText: newCaptcha.data,
          alert: "",
        });
      }
    } catch (validationError) {
      console.error("Error in validation:", validationError);
      res.status(400).send("Bad Request");
      return;
    }

    // Verify data
    try {
      const verifyData = await services.verifyAdminData(adminEmail);
      console.log("Verify======", verifyData);

      if (verifyData.length > 0) {
        const message = "You are already Registered";
        const newCaptcha = await helper.generateCaptcha();
        req.session.captchaText = newCaptcha.text;
        return res.render("admin/adminRegister", {
          captcha_error,
          adminNameError,
          adminEmailError,
          adminPasswordError,
          adminImageError,
          adminConfPasswordError,
          adminName,
          adminEmail,
          adminPassword,
          adminConfPassword,
          message,
          captchaText: newCaptcha.data,
          alert: "",
        });
      }
    } catch (verifyError) {
      console.error("Error in verifyData:", verifyError);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Save image and insert admin data
    try {
      const user_image = req.file.buffer;
      const imagePath = "adminImages/" + req.file.originalname;
      const imageName = req.file.originalname;
      fs.writeFileSync(imagePath, user_image);
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const insertAdminData = await services.insertAdminData(
        adminName,
        adminEmail,
        imageName,
        hashedPassword
      );

      if (insertAdminData.success) {
        const newCaptcha = await helper.generateCaptcha();
        req.session.captchaText = newCaptcha.text;
        return res.render("admin/adminRegister", {
          captcha_error,
          adminNameError,
          adminEmailError,
          adminPasswordError,
          adminImageError,
          adminConfPasswordError,
          adminName,
          adminEmail,
          adminPassword,
          adminConfPassword,
          message: "",
          captchaText: newCaptcha.data,
          alert: "yes",
        });
      }
    } catch (insertError) {
      console.error("Error in insertAdminData:", insertError);
      res.status(500).send("Internal Server Error");
      return;
    }
  } catch (error) {
    // Handle any other unexpected error
    console.error("Unexpected error in validateRegister:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function loginPage(req, res) {
  let captchaText = await helper.generateCaptcha();
  req.session.captchaText = captchaText.text;
  return res.render("admin/adminLogin", {
    adminEmail: "",
    adminPassword: "",
    adminEmailError: "",
    adminPasswordError: "",
    captcha_error: "",
    captchaText: captchaText.data,
    alert: "",
  });
}

async function loginCredentials(req, res) {
  try {
    const { adminEmail, adminPassword, captcha } = req.body;
    const enteredCaptcha = captcha || "";
    const storedCaptcha = req.session.captchaText || "";
    const adminLoginErrors = await helper.validateAdminLoginCredentials(
      adminEmail,
      adminPassword,
      enteredCaptcha,
      storedCaptcha
    );
    console.log("validation");
    if (
      adminLoginErrors.email ||
      adminLoginErrors.password ||
      adminLoginErrors.captcha
    ) {
      const newCaptcha = await helper.generateCaptcha();
      req.session.captchaText = newCaptcha.text;
      return res.render("admin/adminLogin", {
        adminEmail: adminEmail,
        adminPassword: adminPassword,
        adminEmailError: adminLoginErrors.email,
        adminPasswordError: adminLoginErrors.password,
        captcha_error: adminLoginErrors.captcha,
        captchaText: newCaptcha.data,
        alert: "",
      });
    }
    const verifyAdmin = await services.verifyAdmin(adminEmail);
    if (verifyAdmin && verifyAdmin.length > 0) {
      const admin = verifyAdmin[0];
      const bcryptPassword = await bcrypt.compare(
        adminPassword,
        admin.admin_password
      );
      if (bcryptPassword) {
        const adminId = admin.admin_id;
        const expiresInHours = 90;
        const expirationTime = new Date(
          Date.now() + expiresInHours * 60 * 60 * 1000
        );
        const adminToken = jwt.sign({ adminEmail }, secretKey, {
          expiresIn: `${expiresInHours}h`,
        });

        res.cookie("adminToken", adminToken, {
          httpOnly: true,
          expires: expirationTime,
        });

        res.cookie("adminId", adminId, {
          expires: expirationTime,
          httpOnly: true,
        });
        return res.render("admin/adminLogin", {
          alert: "yes",
          adminEmail: "",
          adminPassword: "",
          adminEmailError: "",
          adminPasswordError: "",
          captcha_error: "",
          captchaText: "",
        });
      } else {
        const newCaptcha = await helper.generateCaptcha();
        req.session.captchaText = newCaptcha.text;

        return res.render("admin/adminLogin", {
          adminEmail: adminEmail,
          adminPassword: adminPassword,
          adminEmailError: adminLoginErrors.email,
          adminPasswordError: "Incorrect Password",
          captcha_error: adminLoginErrors.captcha,
          captchaText: newCaptcha.data,
          alert: "",
        });
      }
    } else {
      const newCaptcha = await helper.generateCaptcha();
      req.session.captchaText = newCaptcha.text;

      return res.render("admin/adminLogin", {
        adminEmail: adminEmail,
        adminPassword: adminPassword,
        adminEmailError: "Email not found",
        adminPasswordError: adminLoginErrors.password,
        captcha_error: adminLoginErrors.captcha,
        captchaText: newCaptcha.data,
        alert: "",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send("Internal Server Error");
  }
}

const verifyToken = (req, res, next) => {
  const adminToken = req.cookies.adminToken;

  if (!adminToken) {
    return res.redirect("/admin/login");
  }

  const decoded = jwt.verify(adminToken, secretKey, (err, authData) => {
    if (err) {
      res.redirect("/admin/login");
    }
    next();
  });
};

module.exports = {
  registerPage,
  validateRegister,
  loginPage,
  loginCredentials,
  verifyToken,
};
