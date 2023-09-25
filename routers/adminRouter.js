const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.post('/getUserInfo', adminController.getUserInfo);
router.post('/addCoupon', adminController.addCouponToUser);
router.post('/getDepositHistory', adminController.getDepositHistory);
router.post('/getCoupons', adminController.getCoupons);
router.post('/getOneUserInfo', adminController.getOneUserInfo);

module.exports = router;