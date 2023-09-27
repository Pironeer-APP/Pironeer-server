const nodemailer = require("nodemailer");
const authModel = require('../models/authModel.js');
const createHTML = require('../nodemailer/createHTML.js');
const userModel = require("../models/userModel.js");

module.exports = {
  login: async (req, res) => {
    const loginData = req.body;
    const data = await authModel.login(loginData);

    res.json({data: data});
  },
  addUser: async (req, res) => {
    const newUserData = req.body;
    try {
      const randPassword = Math.random().toString(36).substring(2,11);
      
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
        res.json({result: result});
      } catch(error) {
        console.log(error);
      }
    } catch {
      res.json(null);
    }
  },
  compareInfo: async (req, res) => {
    const type = req.params.type;
    const data = req.body;
    console.log(type, data);
    const result = await authModel.compareInfo(data, type);
    console.log(result);

    res.json({result: result});
  },
  updateInfo: async (req, res) => {
    const type = req.params.type;
    const data = req.body;
    console.log(data);
    if(type === 'phone') {
      const result = await authModel.updatePhone(data);
    } else if(type === 'password') {
      const result = await authModel.updatePassword(data);
    } else if(type === 'email') {
      const result = await authModel.updateEmail(data);
    }

    const updatedUserInfo = await userModel.getOneUserInfo(data);
    console.log(updatedUserInfo);

    res.json({updatedUserInfo: updatedUserInfo});
  },
  unregister: async (req, res) => {
    const userInfo = req.body;
    const result = await authModel.unregister(userInfo);

    res.json({result: result});
  }
}