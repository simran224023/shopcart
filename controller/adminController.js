const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cookie = require("cookie-parser");
const secretKey = "MAiMtInStiTute";
const helper = require("../helperFiles/helper");
const services = require("../servicesFiles/services");
const { get } = require("../routes/userRoutes");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csv-parser");

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
    if (getProductById.success) {
      return res.render("admin/editProducts", {
        getProductById: getProductById.result,
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
    }
  } catch (error) {
    console.log("Error in Fetching edit Products", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function editProductsValidateAndUpdate(req, res) {
  try {
    const productId = req.params.productId;
    const getProductById = await services.getProductById(productId);
    console.log("getProductById", getProductById.result[0].product_image1);
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
      : "";
    const product_image2 = req.files["product_image2"]
      ? req.files["product_image2"][0]
      : "";
    const product_image3 = req.files["product_image3"]
      ? req.files["product_image3"][0]
      : "";
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
    const validationError = await helper.validateEditProducts(payload);
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
      return res.render("admin/editProducts", {
        getCategories,
        getProductById: getProductById.result,
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

    const productImageName1 = req.files["product_image1"]
      ? req.files["product_image1"][0].originalname
      : getProductById.result[0].product_image1;

    const productImageName2 = req.files["product_image2"]
      ? req.files["product_image2"][0].originalname
      : getProductById.result[0].product_image2;

    const productImageName3 = req.files["product_image3"]
      ? req.files["product_image3"][0].originalname
      : getProductById.result[0].product_image3;

    const updatePayload = {
      product_title,
      product_description,
      product_keywords,
      product_category,
      productImageName1,
      productImageName2,
      productImageName3,
      product_price,
      bestseller,
      productId,
    };
    const updateProductsData = await services.updateProductsData(updatePayload);
    if (updateProductsData.success) {
      if (req.files["product_image1"]) {
        const productImage1 = req.files["product_image1"][0].buffer;
        const productImagePath1 =
          "productsImages/" + req.files["product_image1"][0].originalname;
        fs.writeFileSync(productImagePath1, productImage1);
      }
      if (req.files["product_image2"]) {
        const productImage2 = req.files["product_image2"][0].buffer;
        const productImagePath2 =
          "productsImages/" + req.files["product_image2"][0].originalname;
        fs.writeFileSync(productImagePath2, productImage2);
      }
      if (req.files["product_image3"]) {
        const productImage3 = req.files["product_image3"][0].buffer;
        const productImagePath3 =
          "productsImages/" + req.files["product_image3"][0].originalname;
        fs.writeFileSync(productImagePath3, productImage3);
      }
      return res.render("admin/editProducts", {
        getCategories: "",
        getProductById: getProductById.result,
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
    console.log("Error in Edit Products", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function exportProductData(req, res) {
  try {
    const getProduct = await services.getAllProducts();

    // Create a CSV file
    const csvWriter = createCsvWriter({
      path: "products.csv",
      header: Object.keys(getProduct[0]).map((field) => ({
        id: field,
        title: field,
      })),
    });
    await csvWriter.writeRecords(getProduct);

    // Read the CSV file
    const csvFilePath = "products.csv";
    const fileContent = fs.readFileSync(csvFilePath);

    // Set response headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");

    // Send the file content in the response
    res.send(fileContent);

    // Optionally, you may want to delete the file after sending it
    fs.unlinkSync(csvFilePath);

    console.log("Data exported to products.csv successfully!");
  } catch (error) {
    console.error("Error in Export Products", error);
    res.status(500).send("Internal Server Error");
  }
}

async function importProductData(req, res) {
  try {
    const csvFilePath = "products.csv";

    // Create a promise to handle the asynchronous process
    const importPromise = new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", async (row) => {
          try {
            // Adjust the following code based on your CSV file structure
            await services.insertImportProductData(row);
          } catch (error) {
            reject(error);
          }
        })
        .on("end", () => {
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    // Wait for the import process to finish before responding to the client
    await importPromise;

    console.log("Data imported successfully!");
    return res.redirect("/admin/viewProducts");
  } catch (error) {
    console.error("Error in import Products", error);
    res.status(500).send("Internal Server Error");
  }
}

async function insertCategoryPage(req, res) {
  try {
    return res.render("admin/insertCategory", { alert: "" });
  } catch (error) {
    console.error("Error in insert Category Page", error);
    res.status(500).send("Internal Server Error");
  }
}

async function insertCategory(req, res) {
  try {
    const categoryTitle = req.body.cat_title;
    const imageName = req.file.originalname;
    const payload = { categoryTitle, imageName };
    const insertCategory = await services.insertCategory(payload);
    if (insertCategory.success) {
      const categoryImage = req.file.buffer;
      const imagePath = "categoryImages/" + req.file.originalname;
      fs.writeFileSync(imagePath, categoryImage);
      return res.render("admin/insertCategory", { alert: "yes" });
    }
  } catch (error) {
    console.error("Error in insert Category", error);
    res.status(500).send("Internal Server Error");
  }
}

async function viewCategoryPage(req, res) {
  try {
    const getCategory = await services.getCategories();
    res.render("admin/viewCategory", { getCategory });
  } catch (error) {
    console.error("Error in view Category", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const deleteCategory = await services.deleteCategoryByCategoryId(
      categoryId
    );
    if (deleteCategory.success) {
      return res.redirect("/admin/viewCategory");
    }
  } catch (error) {
    console.log("Error in deleting Category", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function editCategoryPage(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const getCategoryByCategoryId = await services.getCategoryByCategoryId(
      categoryId
    );
    if (getCategoryByCategoryId.success) {
      return res.render("admin/editCategory", {
        getCategoryByCategoryId: getCategoryByCategoryId.result,
        categoryTitleError: "",
        alert: "",
      });
    }
  } catch (error) {
    console.log("Error in Fetching edit category", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function editCategory(req, res) {
  try {
    let categoryTitleError;
    const categoryId = req.params.categoryId;
    const getCategoryByCategoryId = await services.getCategoryByCategoryId(
      categoryId
    );
    const categoryTitle = req.body.cate_title;

    if (!categoryTitle) {
      categoryTitleError = "Category is required";
    }

    if (categoryTitleError) {
      return res.render("admin/editCategory", {
        getCategoryByCategoryId: getCategoryByCategoryId.result,
        categoryTitleError,
        alert: "",
      });
    }

    const categoryImageName = req.file
      ? req.file.originalname
      : getCategoryByCategoryId.result[0].category_image;

    const payload = {
      categoryImageName,
      categoryId,
      categoryTitle,
    };

    const updateCategory = await services.updateCategory(payload);

    if (updateCategory.success) {
      if (req.file) {
        const categoryImage = req.file.buffer;
        const categoryImagePath = "categoryImages/" + req.file.originalname;
        fs.writeFileSync(categoryImagePath, categoryImage);
      }

      return res.render("admin/editCategory", {
        getCategoryByCategoryId: getCategoryByCategoryId.result,
        categoryTitleError: "",
        alert: "yes",
      });
    }
  } catch (error) {
    console.log("Error in Edit Category", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function getAllOrdersPage(req, res) {
  try {
    const userOrders = await services.getAllOrders();
    if (userOrders.success) {
      return res.render("admin/allOrders", {
        userOrders: userOrders.result,
      });
    }
  } catch (error) {
    console.log("Error in Fetching all orders", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function getAllPaymentsPage(req, res) {
  try {
    const userPayments = await services.getAllPayments();
    if (userPayments.success) {
      return res.render("admin/allPayments", {
        userPayments: userPayments.result,
      });
    }
  } catch (error) {
    console.log("Error in Fetching All Payments", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function getAllUsersPage(req, res) {
  try {
    const getAllUsers = await services.getAllUsers();
    if (getAllUsers.success) {
      return res.render("admin/listUsers", {
        getAllUsers: getAllUsers.result,
        alert: "",
      });
    }
  } catch (error) {
    console.log("Error in Fetching All Users", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function deleteUserById(req, res) {
  try {
    const userId = req.params.userId;
    const getUser = await services.deleteUser(userId);
    const getAllUsers = await services.getAllUsers();
    if (getUser.success) {
      res.clearCookie("token");
      res.clearCookie("userId");
      return res.render("admin/listUsers", {
        getAllUsers: getAllUsers.result,
        alert: "yes",
      });
    }
  } catch (error) {
    console.log("Error in Fetching All Users", error);
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
  editProductsValidateAndUpdate,
  exportProductData,
  importProductData,
  insertCategoryPage,
  insertCategory,
  viewCategoryPage,
  deleteCategory,
  editCategoryPage,
  editCategory,
  getAllOrdersPage,
  getAllPaymentsPage,
  getAllUsersPage,
  deleteUserById,
};
