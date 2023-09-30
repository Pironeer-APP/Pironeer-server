const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController.js');

router.post('/getDepositHistory', depositController.getDepositHistory);
router.post('/getCoupons', depositController.getCoupons);
router.post('/createCoupon', depositController.createCoupon);
module.exports = router;