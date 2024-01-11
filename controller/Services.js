const conn = require("../Includes/connection");
async function getCategories() {
  const sqlCategory = "SELECT * FROM categories";

  return new Promise((resolve, reject) => {
    conn.query(sqlCategory, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function getAllProducts() {
  const sqlProduct = "SELECT * FROM products";

  return new Promise((resolve, reject) => {
    conn.query(sqlProduct, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function getProductsByProductId(productId) {
  const sqlProduct = "SELECT * FROM products where product_id = ?";

  return new Promise((resolve, reject) => {
    conn.query(sqlProduct, [productId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function getProductsByCategoryId(categoryId) {
  const sqlProduct = "SELECT * FROM products where category_id = ?";

  return new Promise((resolve, reject) => {
    conn.query(sqlProduct, [categoryId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
async function getCategoryProducts(req, res) {
  try {
    const categories = await getCategories();
    const products = await getAllProducts();
    res.render("index", { categories, products });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getProducts(req, res) {
  try {
    const categoryId = req.params.id;
    const categories = await getCategories();
    const products = await getProductsByCategoryId(categoryId);
    res.render("getCategoryProducts", { categories, products });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getViewMore(req, res) {
  try {
    const productId = req.params.id;
    const categories = await getCategories();
    const products = await getProductsByProductId(productId);
    res.render("viewmore", { categories, products });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}


async function getSearchProducts(req,res){
  try {
    const searchTerm = req.body.searchTerm;
    const categories = await getCategories();
    const products = await getProductsBySearchTerm(searchTerm);
    res.render("searchproducts", { categories, products });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getProductsBySearchTerm(searchTerm){
  const query = `SELECT * FROM products WHERE product_keywords LIKE '%${searchTerm}%'`;
  return new Promise((resolve, reject) => {
    conn.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

module.exports = {
  getCategoryProducts,
  getProducts,
  getViewMore,
  getSearchProducts
};
