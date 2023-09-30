const depositModel = require('../models/depositModel.js');
const jwt = require('jsonwebtoken');

module.exports = {
  getDepositHistory: async (req, res) => {
    const userInfo = req.body.userInfo;
    console.log(1);
    console.log(req.body)
    console.log(userInfo.user_id)
    console.log ('1123123'+userInfo);
    const histories = await depositModel.getDepositHistory(userInfo);
    console.log(histories);
    console.log(3)
    res.json({histories: histories});
  },
  getCoupons: async (req, res) => {
    const userInfo = req.body.userInfo;
    const couponInfo = await depositModel.getCoupons(userInfo);

    console.log(couponInfo);
    res.json({couponInfo: couponInfo});
  },
}