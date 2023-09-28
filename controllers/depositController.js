const depositModel = require('../models/depositModel.js');
const jwt = require('jsonwebtoken');

module.exports = {
  getDepositHistory: async (req, res) => {
    const userInfo = req.body.userInfo;
    console.log(userInfo);
    const histories = await depositModel.getDepositHistory(userInfo);

    res.json({histories: histories});
  },
  getCoupons: async (req, res) => {
    const userInfo = req.body.userInfo;
    const couponInfo = await depositModel.getCoupons(userInfo);

    console.log(couponInfo);
    res.json({couponInfo: couponInfo});
  },
}