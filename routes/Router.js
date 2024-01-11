const express = require('express');
const router = express.Router();
const controller = require('../controller/controllerfunctions');

router.get("/",controller.IndexPage);
router.get("/getCategory/:id",controller.ProductPage)
router.get("/viewmore/:id",controller.ViewMore)
router.post("/search", controller.SearchPage)

module.exports = router;