const adminModel = require('../models/adminModel.js');

module.exports = {
  getUserInfo: async (req, res) => {
    const adminLevel = req.body.level;
    const userInfoList = await adminModel.getUserInfo(adminLevel);

    res.json({userInfoList: userInfoList});
  },
  addCouponToUser: async (req, res) => {
    const couponData = req.body;
    const result = await adminModel.addCouponToUser(couponData);

    res.json({result: result});
  },
}