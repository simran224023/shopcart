// Import necessary modules
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const router = require("./routes/router");
const PORT = process.env.PORT

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Serve static files from the "images" directory under the "/images" path
app.use("/images", express.static("images"));
app.use("/uploads", express.static("uploads"));
app.use("/adminImages", express.static("adminImages"));
app.use("/productsImages", express.static("productsImages"));
app.use("/categoryImages", express.static("categoryImages"));

// Set up session middleware with a secret, disabling resaving, enabling uninitialized sessions, and configuring the session cookie
app.use(
  session({
    secret: "MAiMtInStiTute",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 90 * 60 * 60 * 1000, // 90 hours in milliseconds
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  })
);

// Set up middleware to parse cookies and JSON-formatted request bodies
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // Set up routes using the router defined in "./routes/Router"
app.use("/", router);

// // Start the server and listen on port 3009
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
