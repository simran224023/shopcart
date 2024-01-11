const express = require('express');
const router = express.Router();
const controller = require('../controller/DBquery');


router.get("/",controller.getIndexPage);

module.exports = router;