const services = require("../DBservices/services");
const helper = require("../Helpers/helper");
async function IndexPage(req, res) {
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
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
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

async function ProductPage(req, res) {
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
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
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

async function ViewMore(req, res) {
  try {
    const productId = req.params.id;
    const categories = await services.getCategories();
    const products = await services.getProductsByProductId(productId);
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
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      return res.render("viewmore", {
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

async function SearchPage(req, res) {
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
    const totalAmountResult = await services.CalculateTotalAmount(userId);
    const totalQuantityResult = await services.CalculateTotalQuantity(userId);
    if (totalAmountResult.success && totalQuantityResult.success) {
      const totalAmount = totalAmountResult.totalAmount;
      const totalQuantity = totalQuantityResult.totalQuantity;
      return res.render("searchproducts", {
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

async function ContactPage(req, res) {
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
  const totalAmountResult = await services.CalculateTotalAmount(userId);
  const totalQuantityResult = await services.CalculateTotalQuantity(userId);
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

async function CartPage(req, res) {
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

async function ProfilePage(req, res) {
  let isLoggedIn;
  const userId = req.cookies.userId;
  isLoggedIn = true;
  const [userInfo] = await services.getUserInfo({ userId });
  const totalAmountResult = await services.CalculateTotalAmount(userId);
  const totalQuantityResult = await services.CalculateTotalQuantity(userId);
  const totalAmount = totalAmountResult.totalAmount;
  const totalQuantity = totalQuantityResult.totalQuantity;
  const profileImage = await services.fetchProfileImage(userId);
  const pendingOrders = await services.getPendingOrders(userId);
  const pendingOrdersCount = pendingOrders.pendingOrdersCount;
  console.log("pending===", pendingOrdersCount);
  const userProfileImage = profileImage.Image[0].user_image;
  res.render("user/myprofile", {
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

async function AddToCart(req, res) {
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

module.exports = {
  IndexPage,
  ProductPage,
  ViewMore,
  SearchPage,
  ContactPage,
  CartPage,
  ProfilePage,
  AddToCart,
  updateQuantity,
  removeItem,
  getPendingOrders,
};
