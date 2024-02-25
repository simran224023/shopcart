const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cookie = require("cookie-parser");
const secretKey = "MAiMtInStiTute";
const helper = require("../helperFiles/helper");
const services = require("../servicesFiles/services");
const { get } = require("../routes/userRoutes");

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

async function dashboardPage(req, res) {
  const adminId = req.cookies.adminId;
  const [getAdminInfo] = await services.getAdminInfo({ adminId });
  const adminImage = getAdminInfo.admin_image;
  const adminName = getAdminInfo.admin_name;
  console.log(adminImage);
  res.render("admin/adminDashboard", {
    adminImage,
    adminName,
  });
}

async function adminLogout(req, res) {
  res.clearCookie("adminToken");
  res.clearCookie("adminId");
  res.redirect("/admin/login");
}

async function insertProductsPage(req, res) {
  try {
    const getCategories = await services.getCategories();
    res.render("admin/insertProducts", {
      getCategories,
      product_title_error: "",
      product_description_error: "",
      product_keywords_error: "",
      product_category_error: "",
      product_price_error: "",
      product_image1_error: "",
      product_image2_error: "",
      product_image3_error: "",
      bestseller_error: "",
      product_title: "",
      product_description: "",
      product_keywords: "",
      product_category: "",
      product_price: "",
      bestseller: "",
      alert: "",
    });
  } catch (error) {
    console.log("Error in Fetching Insert Products Page", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function insertProducts(req, res) {
  try {
    const getCategories = await services.getCategories();
    const {
      product_title,
      product_description,
      product_keywords,
      product_category,
      product_price,
      bestseller,
    } = req.body;
    const product_image1 = req.files["product_image1"]
      ? req.files["product_image1"][0]
      : undefined;
    const product_image2 = req.files["product_image2"]
      ? req.files["product_image2"][0]
      : undefined;
    const product_image3 = req.files["product_image3"]
      ? req.files["product_image3"][0]
      : undefined;
    const payload = {
      product_title,
      product_description,
      product_keywords,
      product_category,
      product_price,
      bestseller,
      product_image1,
      product_image2,
      product_image3,
    };
    console.log("product_category", product_category);
    const validationError = await helper.validateInsertProducts(payload);
    const product_title_error = validationError.product_title_error;
    const product_description_error = validationError.product_description_error;
    const product_keywords_error = validationError.product_keywords_error;
    const product_category_error = validationError.product_category_error;
    const product_price_error = validationError.product_price_error;
    const product_image1_error = validationError.product_image1_error;
    const product_image2_error = validationError.product_image2_error;
    const product_image3_error = validationError.product_image3_error;
    const bestseller_error = validationError.bestseller_error;
    if (
      product_title_error ||
      product_description_error ||
      product_keywords_error ||
      product_category_error ||
      product_price_error ||
      product_image1_error ||
      product_image2_error ||
      product_image3_error ||
      bestseller_error
    ) {
      return res.render("admin/insertProducts", {
        getCategories,
        product_title_error,
        product_description_error,
        product_keywords_error,
        product_category_error,
        product_price_error,
        product_image1_error,
        product_image2_error,
        product_image3_error,
        bestseller_error,
        product_title,
        product_description,
        product_keywords,
        product_category,
        product_price,
        bestseller,
        alert: "",
      });
    }

    const productImageName1 = req.files["product_image1"][0].originalname;

    const productImageName2 = req.files["product_image2"][0].originalname;

    const productImageName3 = req.files["product_image3"][0].originalname;

    const insertPayload = {
      product_title,
      product_description,
      product_keywords,
      product_category,
      productImageName1,
      productImageName2,
      productImageName3,
      product_price,
      bestseller,
    };
    const insertProductsData = await services.insertProductsData(insertPayload);
    if (insertProductsData.success) {
      const productImage1 = req.files["product_image1"][0].buffer;
      const productImagePath1 =
        "productsImages/" + req.files["product_image1"][0].originalname;
      fs.writeFileSync(productImagePath1, productImage1);

      const productImage2 = req.files["product_image2"][0].buffer;
      const productImagePath2 =
        "productsImages/" + req.files["product_image2"][0].originalname;
      fs.writeFileSync(productImagePath2, productImage2);
      const productImage3 = req.files["product_image3"][0].buffer;
      const productImagePath3 =
        "productsImages/" + req.files["product_image3"][0].originalname;
      fs.writeFileSync(productImagePath3, productImage3);
      return res.render("admin/insertProducts", {
        getCategories: "",
        product_title_error: "",
        product_description_error: "",
        product_keywords_error: "",
        product_category_error: "",
        product_price_error: "",
        product_image1_error: "",
        product_image2_error: "",
        product_image3_error: "",
        bestseller_error: "",
        product_title: "",
        product_description: "",
        product_keywords: "",
        product_category: "",
        product_price: "",
        bestseller: "",
        alert: "yes",
      });
    }
  } catch (error) {
    console.log("Error in Fetching Insert Products", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function viewProductsPage(req, res) {
  try {
    const getProducts = await services.getAllProducts();
    const orderPending = await services.getOrderPending();
    if (orderPending.success) {
      const orderPendingResult = orderPending.result;
      return res.render("admin/viewProducts", {
        getProducts,
        orderPendingResult,
      });
    }
  } catch (error) {
    console.log("Error in Fetching View Products", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function deleteProducts(req, res) {
  try {
    const productId = req.params.productId;
    const deleteProducts = await services.deleteProductsByProductId(productId);
    if (deleteProducts.success) {
      return res.redirect("/admin/viewProducts");
    }
  } catch (error) {
    console.log("Error in deleting Products", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function editProductsPage(req, res) {
  try {
    const productId = req.params.productId;
    const getProductById = await services.getProductById(productId);
    const getCategories = await services.getCategories();
console.log("getProductById",getProductById.result)
    if (getProductById.success) {
      return res.render("admin/editProducts", {
        getProductById: getProductById.result,
        getCategories,
      });
    }
  } catch (error) {
    console.log("Error in Fetching edit Products", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  registerPage,
  validateRegister,
  loginPage,
  loginCredentials,
  verifyToken,
  dashboardPage,
  adminLogout,
  insertProductsPage,
  insertProducts,
  viewProductsPage,
  deleteProducts,
  editProductsPage,
};
