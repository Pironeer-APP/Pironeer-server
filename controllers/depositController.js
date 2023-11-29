const depositModel = require('../models/depositModel.js');
const jwt = require('jsonwebtoken');

module.exports = {
  getDepositHistory: async (req, res) => {
    const userInfo = req.body.account;
    const histories = await depositModel.getDepositHistory(userInfo);
    console.log(histories)
    res.json({ histories: histories });
  },
  getDepositHistoryAdmin: async (req, res) => {
    const userInfo = req.body.userInfo;
    try {
      const histories = await depositModel.getDepositHistory(userInfo);
      console.log(histories)
      res.json({ histories: histories });
    } catch (error) {
      console.log(error);
      res.json({ histories: [] });
    }
  },
  getCoupons: async (req, res) => {
    const userInfo = req.body.account;
    const couponInfo = await depositModel.getCoupons(userInfo);
    res.json({ couponInfo: couponInfo });
  },
  getCouponsAdmin: async (req, res) => {
    const userInfo = req.body.userInfo;
    const couponInfo = await depositModel.getCoupons(userInfo);
    res.json({ couponInfo: couponInfo });
  },
  addCouponToUser: async (req, res) => {
    const couponData = req.body;
    const result = await depositModel.addCouponToUser(couponData);

    res.json({ result: result });
  },
  deleteCoupon: async (req, res) => {
    const adminInfo = req.body.account;
    if (adminInfo.is_admin) { // 관리자만 삭제 가능
      await depositModel.deleteCoupon(req.body.userInfo.user_id);
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
  },
  useCoupon: async (req, res) => {
    const user_id = req.body.userId;
    await depositModel.useCoupon(user_id);
    res.json({});
  }
}