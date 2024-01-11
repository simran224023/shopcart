const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./routes/Router')

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/images", express.static("images"));

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// routes
app.use("/",router);

// listening to portno
app.listen(3009, () => {
  console.log(`Server is running on 3009`);
});
