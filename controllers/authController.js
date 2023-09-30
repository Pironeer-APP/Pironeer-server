const authModel = require('../models/authModel.js');
const userModel = require("../models/userModel.js");
const jwt = require('jsonwebtoken');
const mailer = require("../nodemailer/mailer.js");

module.exports = {
  login: async (req, res) => {
    const loginData = req.body;
    try {
      const data = await authModel.login(loginData);
      console.log(data);
      if(data) {
        const token = jwt.sign(data, process.env.JWT);
        res.json({ token: token });
      } else {
        res.json({ token: false });
      }
    } catch (error) {
      res.json({ token: false });
    }
  },
  findAccount: async (req, res) => {
    const phone = req.body.phone;
    try {
      const newPassword = Math.random().toString(36).substring(2, 11);
      const account = await userModel.getUserByPhone(phone);
      if (account) {
        await authModel.findAccount(phone, newPassword);
        const result = await mailer(account.email, account.name, phone, newPassword);
        res.json(result);
      } else {
        res.json({ result: false });
      }
    } catch (error) {
      res.json({ result: false });
    }
  },
  addUser: async (req, res) => {
    const body = req.body;
    try {
      const randPassword = Math.random().toString(36).substring(2, 11);
      const result = await authModel.addUser(body, randPassword);

      // 합격자 정보 이메일 전송
      const mailerResult = await mailer(body.email, body.name, body.phone, randPassword);

      return mailerResult;
    } catch (error) {
      res.json(null);
    }
  },
  compareInfo: async (req, res) => {
    const type = req.params.type;
    const data = req.body.data;
    try {
      const userInfo = jwt.verify(req.body.user_token, process.env.JWT);
      const result = await authModel.compareInfo(data, type, userInfo);

      res.json({ result: result });
    } catch (error) {
      res.json({ result: null });
    }
  },
  updateInfo: async (req, res) => {
    const type = req.params.type;
    const body = req.body;
    const data = body.data;
    try {
      const userInfo = jwt.verify(body.user_token, process.env.JWT);
      if (type === 'phone') {
        await authModel.updatePhone(data, userInfo.user_id);
      } else if (type === 'password') {
        await authModel.updatePassword(data, userInfo.user_id);
      } else if (type === 'email') {
        await authModel.updateEmail(data, userInfo.user_id);
      } else if (type === 'level' && userInfo.is_admin) { // 관리자만 기수 변경 가능
        await authModel.updateLevel(data, userInfo.user_id);
      }

      let updatedUserInfo = await userModel.getOneUserInfo(userInfo.user_id);
      try {
        updatedUserInfo = jwt.sign(updatedUserInfo, process.env.JWT);

        res.json({ updatedUserInfo: updatedUserInfo });
      } catch (error) {
        res.json({ updatedUserInfo: null });
      }
    } catch (error) {
      res.json({ updatedUserInfo: null });
    }
  },
  unregister: async (req, res) => {
    const userInfo = req.body;
    const result = await authModel.unregister(userInfo);

    res.json({ result: result });
  }
}