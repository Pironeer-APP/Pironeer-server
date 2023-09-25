const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.post('/getUserInfo', adminController.getUserInfo);
router.post('/addCoupon', adminController.addCouponToUser);

module.exports = router;