const express = require("express");
const path = require("path")
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const router = require('./routes/Router')

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(session({ secret: 'MAiMtInStiTute', resave: false, saveUninitialized: true }));

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
