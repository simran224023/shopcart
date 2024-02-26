const services = require("../servicesFiles/services");
const helper = require("../helperFiles/helper");
const fs = require("fs");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: "rzp_test_vYw0QMxTGojoMY",
  key_secret: "hkIVd7CkGLT4tpoRTBr1H2GE",
});
async function indexPage(req, res) {
  try {
    let isLoggedIn;
    const categories = await services.getCategories();
    const products = await services.getAllProducts();
    const userId = req.cookies.userId;
    if (!userId) {
      return res.render("index", {
        categories,
        products,
        isLoggedIn: false,
        username: "",
        totalAmount: 0,
        totalQuantity: 0,
      });
    }
    isLoggedIn = true;
    const [userInfo] = await services.getUserInfo({ userId });
    const totalAmountResult = await services.calculateTotalAmount(userId);
    const totalQuantityResult = await services.calculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      return res.render("index", {
        categories,
        products,
        isLoggedIn,
        username: userInfo.user_name,
        totalAmount,
        totalQuantity,
      });
    }
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function productPage(req, res) {
  try {
    const categoryId = req.params.id;
    const categories = await services.getCategories();
    const products = await services.getProductsByCategoryId(categoryId);
    let isLoggedIn;
    const userId = req.cookies.userId;
    if (!userId) {
      return res.render("getCategoryProducts", {
        categories,
        products,
        isLoggedIn: false,
        username: "",
        totalAmount: 0,
        totalQuantity: 0,
      });
    }
    isLoggedIn = true;
    const [userInfo] = await services.getUserInfo({ userId });
    const totalAmountResult = await services.calculateTotalAmount(userId);
    const totalQuantityResult = await services.calculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      return res.render("getCategoryProducts", {
        categories,
        products,
        isLoggedIn,
        username: userInfo.user_name,
        totalAmount,
        totalQuantity,
      });
    }
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function viewMore(req, res) {
  try {
    const productId = req.params.id;
    const categories = await services.getCategories();
    const products = await services.getProductsByProductId(productId);
    let isLoggedIn;
    const userId = req.cookies.userId;
    if (!userId) {
      return res.render("viewMore", {
        categories,
        products,
        isLoggedIn: false,
        username: "",
        totalAmount: 0,
        totalQuantity: 0,
      });
    }
    isLoggedIn = true;
    const [userInfo] = await services.getUserInfo({ userId });
    const totalAmountResult = await services.calculateTotalAmount(userId);
    const totalQuantityResult = await services.calculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      return res.render("viewMore", {
        categories,
        products,
        isLoggedIn,
        username: userInfo.user_name,
        totalAmount,
        totalQuantity,
      });
    }
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function searchPage(req, res) {
  try {
    const searchTerm = req.query.q;
    const categories = await services.getCategories();
    const products = await services.getProductsBySearchTerm(searchTerm);
    let isLoggedIn;
    const userId = req.cookies.userId;
    if (!userId) {
      return res.render("getCategoryProducts", {
        categories,
        products,
        searchTerm,
        isLoggedIn: false,
        username: "",
        totalAmount: 0,
        totalQuantity: 0,
      });
    }
    isLoggedIn = true;
    const [userInfo] = await services.getUserInfo({ userId });
    const totalAmountResult = await services.calculateTotalAmount(userId);
    const totalQuantityResult = await services.calculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      return res.render("searchProducts", {
        categories,
        products,
        searchTerm,
        isLoggedIn,
        username: userInfo.user_name,
        totalAmount,
        totalQuantity,
      });
    }
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function contactPage(req, res) {
  let isLoggedIn;
  const userId = req.cookies.userId;
  if (!userId) {
    return res.render("getCategoryProducts", {
      isLoggedIn: false,
      username: "",
      totalAmount: 0,
      totalQuantity: 0,
    });
  }
  isLoggedIn = true;
  const [userInfo] = await services.getUserInfo({ userId });
  const totalAmountResult = await services.calculateTotalAmount(userId);
  const totalQuantityResult = await services.calculateTotalQuantity(userId);
  if (totalAmountResult.success && totalQuantityResult.success) {
    const totalAmount = totalAmountResult.totalAmount;
    const totalQuantity = totalQuantityResult.totalQuantity;
    return res.render("contactUs", {
      isLoggedIn,
      username: userInfo.user_name,
      totalAmount,
      totalQuantity,
    });
  }
}

async function cartPage(req, res) {
  try {
    let isLoggedIn;
    const userId = req.cookies.userId;
    if (!userId) {
      return res.render("cart", {
        isLoggedIn: false,
        username: "",
        totalQuantity: 0,
        totalAmount: 0,
        cartItems: [],
        noItemMessage: "Please Login",
      });
    }
    isLoggedIn = true;
    const [userInfo] = await services.getUserInfo({ userId });

    const totalQuantityResult = await services.calculateTotalQuantity(userId);
    const totalAmountResult = await services.calculateTotalAmount(userId);
    const fetchCartItemsResult = await services.fetchCartItems(userId);

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
        username: userInfo.user_name,
        totalQuantity,
        totalAmount,
        cartItems,
        noItemMessage,
      });
    } else {
      res.render("cart", {
        isLoggedIn,
        username: userInfo.user_name,
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

async function profilePage(req, res) {
  let isLoggedIn;
  const userId = req.cookies.userId;
  isLoggedIn = true;
  const [userInfo] = await services.getUserInfo({ userId });
  const totalAmountResult = await services.calculateTotalAmount(userId);
  const totalQuantityResult = await services.calculateTotalQuantity(userId);
  const totalAmount = totalAmountResult.totalAmount;
  const totalQuantity = totalQuantityResult.totalQuantity;
  const profileImage = await services.fetchProfileImage(userId);
  const pendingOrders = await services.getPendingOrders(userId);
  const pendingOrdersCount = pendingOrders.pendingOrdersCount;
  const userProfileImage = profileImage.Image[0].user_image;
  res.render("user/myProfile", {
    isLoggedIn,
    username: userInfo.user_name,
    totalAmount,
    totalQuantity,
    userProfileImage,
    pendingOrdersCount,
  });
}

async function getPendingOrders(req, res) {
  try {
    const userId = req.cookies.userId;
    const { success, pendingOrdersCount } = await services.getPendingOrders(
      userId
    );
    res.json({ success, pendingOrdersCount });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

async function addToCart(req, res) {
  const productId = req.query.product_id;
  const userId = req.cookies.userId;
  console.log("User_Id===", userId);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Please Login First",
    });
  }

  try {
    console.log("Adding to cart:", productId, userId);
    const added = await services.addCart(productId, userId);
    const totalAmountResult = await services.calculateTotalAmount(userId);
    const totalQuantityResult = await services.calculateTotalQuantity(userId);
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

async function updateQuantity(req, res) {
  const { productId, newQuantity } = req.body;
  const userId = req.cookies.userId;

  try {
    await services.updateQuantityInCart(userId, productId, newQuantity);
    const { totalAmount, totalQuantity } = await helper.recalculateTotals(
      userId
    );
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

async function removeItem(req, res) {
  const { productId } = req.body;
  const userId = req.cookies.userId;

  try {
    await services.removeItemInCart(userId, productId);
    const { totalAmount, totalQuantity } = await helper.recalculateTotals(
      userId
    );
    let message = "Item removed successfully";
    let noItemMessage = "";
    if (totalQuantity == 0) {
      noItemMessage = "No items in the cart";
      message;
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

async function myOrders(req, res) {
  try {
    const userId = req.cookies.userId;
    const [userInfo] = await services.getUserInfo({ userId });
    const user_email = userInfo.user_email;
    if (user_email) {
      const { success, user_orders } = await services.getUserOrders(userId);
      res.json({ success, user_orders });
    }
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

async function cancelOrder(req, res) {
  try {
    const orderId = req.params.orderId;
    if (orderId) {
      const { success, cancel_user_orders } = await services.cancelUserOrders(
        orderId
      );
      res.json({ success, cancel_user_orders });
    }
  } catch (error) {
    console.error("Error canceling user orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

async function editAccountPage(req, res) {
  try {
    const userId = req.cookies.userId;
    const [editAccount] = await services.getUserInfo({ userId });
    const validate = req.query.validate
      ? JSON.parse(decodeURIComponent(req.query.validate))
      : null;
    return res.render("user/editAccount", {
      editAccount,
      validate,
    });
  } catch (error) {
    console.error("Error rendering editAccountPage:", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function updateAccount(req, res) {
  try {
    const userId = req.cookies.userId;
    const [userInfo] = await services.getUserInfo({ userId });
    const user_name = req.body.user_username;
    const user_email = req.body.user_email;
    const user_image = req.file ? req.file.user_image : null;
    const user_address = req.body.user_address;
    const user_mobile = req.body.user_mobile;
    const validate = await helper.updateValidate({
      user_name,
      user_email,
      user_image,
      user_address,
      user_mobile,
    });
    if (validate) {
      return res.status(200).json({ validate });
    } else {
      await services.updateFormData({
        userId,
        user_name,
        user_email,
        user_image,
        user_address,
        user_mobile,
      });
      return res.status(200).json({ success: true });
    }
    // return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function updateFormDataInDatabase(req, res) {
  let formEmail;
  try {
    const formData = req.body;
    const userId = req.cookies.userId;
    if (req.file) {
      const imagePath = `uploads/${req.file.originalname}`;
      fs.writeFileSync(imagePath, req.file.buffer);
      formData.user_image = req.file.originalname;
    }

    const updateResult = await services.updateFormData(formData, userId);
    return res.json({
      success: true,
      message: "Form data updated successfully!",
    });
  } catch (error) {
    console.error("Error updating form data in the database:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function checkout(req, res) {
  try {
    const userId = req.cookies.userId;
    const [getUserInfo] = await services.getUserInfo({ userId });
    const getCheckoutData = await services.getCheckoutData(userId);
    if (getCheckoutData.success) {
      res.render("user/checkoutMain", {
        total_price: getCheckoutData.total_price,
        invoice_number: getCheckoutData.invoice_number,
        count_products: getCheckoutData.count_products,
        name: getUserInfo.user_name,
        address: getUserInfo.user_address,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function checkoutBegin(req, res) {
  const userId = req.cookies.userId;
  const { name, amount, invoice, total_products, deliver_address } = req.body;
  const actualAmount = amount * 100;

  const options = {
    amount: actualAmount,
    currency: "INR",
    receipt: invoice,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    if (order.id) {
      const status = "pending";
      let orderProductId = [];
      const cartDetails = await services.getCartDetails(userId);
      if (cartDetails.cartDetails.length > 0) {
        for (const rowPrice of cartDetails.cartDetails) {
          const productId = rowPrice.product_id;
          orderProductId.push(productId);
          const quantity = rowPrice.quantity;
          const insertOrderPending = await services.insertOrderPending(
            userId,
            invoice,
            productId,
            quantity
          );
        }
      }
const productIdsString = orderProductId.join(',');
      const insertUserOrder = await services.insertUserOrder(
        userId,
        amount,
        invoice,
        total_products,
        status,
        deliver_address,
        productIdsString
      );
      const getUserOrdersDetails = await services.getUserOrdersDetails(invoice);
      const orderId = getUserOrdersDetails.getUserOrdersDetails[0].order_id;
      req.session.orderId = orderId;
      const deleteCartResult = await services.deleteCartDetails(userId);
    }
    res.json({
      success: true,
      orderId: order.id,
      amount: actualAmount,
      currency: "INR",
      name: name,
      totalProducts: total_products,
      invoice: invoice,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating Razorpay order" });
  }
}

async function checkoutPaymentComplete(req, res) {
  const { payment_id } = req.body;

  try {
    if (payment_id) {
      const order_id = req.session.orderId;
      const updateOrderResult = await services.updateUserOrders(order_id);

      if (updateOrderResult.success) {
        const selectOrderResult = await services.selectUserOrders(order_id);
        const userOrder = selectOrderResult.userOrders;
        const statusForm = userOrder.order_status;
        const invoice = userOrder.invoice_number;
        const userId = userOrder.user_id;
        const amount = userOrder.amount_due;
        if (statusForm === "Complete") {
          const paymentMode = "Razorpay";
          const insertPaymentResult = await services.insertUserPayments(
            userId,
            order_id,
            invoice,
            amount,
            paymentMode
          );
        }
      }
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Payment capture failed" });
    }
  } catch (error) {
    console.error("Razorpay payment capture error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error capturing payment" });
  }
}

async function confirmOrders(req, res) {
  try {
    const userId = req.cookies.userId;
    const orderId = req.params.orderId;
    req.session.orderId = orderId;
    const [getUserInfo] = await services.getUserInfo({ userId });
    const getConfirmOrders = await services.getConfirmOrders(orderId);
    if (getConfirmOrders.success) {
      res.render("user/confirmOrders", {
        total_price: getConfirmOrders.getConfirmOrders[0].amount_due,
        invoice_number: getConfirmOrders.getConfirmOrders[0].invoice_number,
        count_products: getConfirmOrders.getConfirmOrders[0].total_products,
        name: getUserInfo.user_name,
        address: getUserInfo.user_address,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

async function confirmOrderBegin(req, res) {
  const userId = req.cookies.userId;
  const { name, amount, invoice, total_products } = req.body;
  const actualAmount = amount * 100;

  const options = {
    amount: actualAmount,
    currency: "INR",
    receipt: invoice,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    if (order.id) {
      return res.json({
        success: true,
        orderId: order.id,
        amount: actualAmount,
        currency: "INR",
        name: name,
        totalProducts: total_products,
        invoice: invoice,
      });
    }
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating Razorpay order" });
  }
}

async function confirmOrderComplete(req, res) {
  const { payment_id } = req.body;

  try {
    if (payment_id) {
      const order_id = req.session.orderId;
      const updateOrderResult = await services.updateUserOrders(order_id);

      if (updateOrderResult.success) {
        const selectOrderResult = await services.selectUserOrders(order_id);
        const userOrder = selectOrderResult.userOrders;
        const statusForm = userOrder.order_status;
        const invoice = userOrder.invoice_number;
        const userId = userOrder.user_id;
        const amount = userOrder.amount_due;

        if (statusForm === "Complete") {
          const paymentMode = "Razorpay";
          const insertPaymentResult = await services.insertUserPayments(
            userId,
            order_id,
            invoice,
            amount,
            paymentMode
          );
        }
      }
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Payment capture failed" });
    }
  } catch (error) {
    console.error("Razorpay payment capture error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error capturing payment" });
  }
}

module.exports = {
  indexPage,
  productPage,
  viewMore,
  searchPage,
  contactPage,
  cartPage,
  profilePage,
  addToCart,
  updateQuantity,
  removeItem,
  getPendingOrders,
  myOrders,
  cancelOrder,
  editAccountPage,
  updateAccount,
  updateFormDataInDatabase,
  checkout,
  checkoutBegin,
  checkoutPaymentComplete,
  confirmOrders,
  confirmOrderBegin,
  confirmOrderComplete,
};
