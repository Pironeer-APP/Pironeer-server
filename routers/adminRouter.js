const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const assignController = require("../controllers/assignController.js");

router.post("/getUserInfo", adminController.getUserInfo);

module.exports = router;