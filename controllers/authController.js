const nodemailer = require("nodemailer");
const authModel = require('../models/authModel.js');
const createHTML = require('../nodemailer/createHTML.js');
const userModel = require("../models/userModel.js");
const jwt = require('jsonwebtoken');

module.exports = {
  login: async (req, res) => {
    const loginData = req.body;
    try {
      const data = await authModel.login(loginData);
      console.log(data);
      const token = jwt.sign(data, process.env.JWT);
      res.json({ token: token });
    } catch (error) {
      res.json({ token: false });
    }
  },
  addUser: async (req, res) => {
    const body = req.body;
    try {
      const newUserData = jwt.verify(body, process.env.JWT);
      try {
        const randPassword = Math.random().toString(36).substring(2, 11);

        const result = await authModel.addUser(newUserData, randPassword);

        // 합격자 정보 이메일 전송
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.PIRO_MAIL,
            pass: process.env.PIRO_MAIL_KEY,
          },
        });

        const htmlBody = createHTML(newUserData, randPassword);
        try {
          const info = await transporter.sendMail({
            from: process.env.PIRO_MAIL,
            to: newUserData.email,
            subject: "[피로그래밍 어플 회원 정보]",
            html: htmlBody,
            attachments: [{
              filename: 'logo.png',
              path: __dirname + '/../public/images/logo.png',
              cid: 'unique@nodemailer.com',
            }]
          });
          console.log("Message sent: %s", info.messageId);
          res.json({ result: result });
        } catch (error) {
          console.log(error);
        }
      } catch {
        res.json(null);
      }
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
      console.log(result);

      res.json({ result: result });
    } catch(error) {
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
      }

      let updatedUserInfo = await userModel.getOneUserInfo(userInfo.user_id);
      try {
        updatedUserInfo = jwt.sign(updatedUserInfo, process.env.JWT);
        console.log(updatedUserInfo);

        res.json({ updatedUserInfo: updatedUserInfo });
      } catch(error) {
        res.json({updatedUserInfo: null});
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