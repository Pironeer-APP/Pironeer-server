const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController.js');

router.post('/getDepositHistory', depositController.getDepositHistory);
router.post('/getDepositHistoryAdmin', depositController.getDepositHistoryAdmin);
router.post('/getCoupons', depositController.getCoupons);
router.post('/getCouponsAdmin', depositController.getCouponsAdmin);
router.post("/addCoupon", depositController.addCouponToUser);
router.post("/deleteCoupon", depositController.deleteCoupon);
router.post("/useCoupon", depositController.useCoupon);

module.exports = router;