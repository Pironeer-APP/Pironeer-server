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
  getDepositHistory: async (req, res) => {
    const userInfo = req.body;
    const histories = await adminModel.getDepositHistory(userInfo);

    res.json({histories: histories});
  },
  getCoupons: async (req, res) => {
    const userInfo = req.body;
    const couponInfo = await adminModel.getCoupons(userInfo);

    console.log(couponInfo);
    res.json({couponInfo: couponInfo});
  },
  getOneUserInfo: async (req, res) => {
    const requestUser = req.body;
    const oneUserInfo = await adminModel.getOneUserInfo(requestUser);

    console.log(oneUserInfo);
    res.json({oneUserInfo: oneUserInfo});
  }
}