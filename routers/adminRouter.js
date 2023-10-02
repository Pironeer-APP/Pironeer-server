const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const assignController = require("../controllers/assignController.js");

router.post("/getUserInfo", adminController.getUserInfo);
router.post("/addCoupon", adminController.addCouponToUser);
router.post("/deleteCoupon", adminController.deleteCoupon);

module.exports = router;