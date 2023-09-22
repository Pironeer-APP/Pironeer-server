const nodemailer = require("nodemailer");
const authModel = require('../models/authModel.js');
const createHTML = require('../nodemailer/createHTML.js');

module.exports = {
  login: async (req, res) => {
    const data = await authModel.login();

    res.send(data);
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
  }
}