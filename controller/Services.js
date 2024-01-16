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

async function getProductsBySearchTerm(searchTerm) {
  const query = `SELECT * FROM products WHERE product_keywords LIKE '%${searchTerm}%'`;
  return new Promise((resolve, reject) => {
    conn.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function VerifyData(user_email,user_mobile) {
  const query = `
    SELECT * FROM user_table
    WHERE user_email = ? or user_mobile = ?;
  `;

  try {
    const result = await new Promise((resolve, reject) => {
      conn.query(
        query,
        [user_email,user_mobile],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    return result;
  } catch (error) {
    console.error("Error in VerifyData:", error);
    throw error; 
  }
}

module.exports = {
  getCategories,
  getAllProducts,
  getProductsByProductId,
  getProductsByCategoryId,
  getProductsBySearchTerm,
  VerifyData,
};
