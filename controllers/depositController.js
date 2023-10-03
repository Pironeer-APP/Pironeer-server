const depositModel = require('../models/depositModel.js');
const jwt = require('jsonwebtoken');

module.exports = {
  getDepositHistory: async (req, res) => {
    const userInfo = req.body.userInfo;
    const histories = await depositModel.getDepositHistory(userInfo);
    res.json({histories: histories});
  },
  getCoupons: async (req, res) => {
    const userInfo = req.body.userInfo;
    const couponInfo = await depositModel.getCoupons(userInfo);
    res.json({couponInfo: couponInfo});
  },
  addCouponToUser: async (req, res) => {
    const couponData = req.body;
    const result = await depositModel.addCouponToUser(couponData);

    res.json({result: result});
  },
  deleteCoupon: async (req, res) => {
    console.log(req.body);
    const adminToken = req.body.adminToken;
    try {
      const adminInfo = jwt.verify(adminToken, process.env.JWT);
      if(adminInfo.is_admin) { // 관리자만 삭제 가능
        await depositModel.deleteCoupon(req.body.coupon_id);
        res.json({result: true});
      } else {
        res.json({result: false});
      }
    } catch(error) {
      console.log(error);
      res.json({result: false});
    }
  }
}