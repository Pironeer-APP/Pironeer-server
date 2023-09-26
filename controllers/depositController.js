const depositModel = require('../models/depositModel.js');

module.exports = {
  getDepositHistory: async (req, res) => {
    const userInfo = req.body;
    const histories = await depositModel.getDepositHistory(userInfo);

    res.json({histories: histories});
  },
  getCoupons: async (req, res) => {
    const userInfo = req.body;
    const couponInfo = await depositModel.getCoupons(userInfo);

    console.log(couponInfo);
    res.json({couponInfo: couponInfo});
  },
}