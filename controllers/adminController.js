const adminModel = require('../models/adminModel.js');
const jwt = require('jsonwebtoken');

module.exports = {
  getUserInfo: async (req, res) => {
    const adminToken = req.body.token;
    try {
      const adminInfo = jwt.verify(adminToken, process.env.JWT);
      if(adminInfo.is_admin) {
        const userInfoList = await adminModel.getUserInfo(adminInfo.level);
        res.json({userInfoList: userInfoList});
      } else {
        res.json({userInfoList: null});
      }
    } catch(error) {
      console.log(error);
      res.json({userInfoList: null});
    }
  },
  addCouponToUser: async (req, res) => {
    const couponData = req.body;
    const result = await adminModel.addCouponToUser(couponData);

    res.json({result: result});
  },
  deleteCoupon: async (req, res) => {
    console.log(req.body);
    const adminToken = req.body.adminToken;
    try {
      const adminInfo = jwt.verify(adminToken, process.env.JWT);
      if(adminInfo.is_admin) { // 관리자만 삭제 가능
        await adminModel.deleteCoupon(req.body.coupon_id);
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