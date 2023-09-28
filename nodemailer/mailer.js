const nodemailer = require("nodemailer");
const createHTML = require('../nodemailer/createHTML.js');

module.exports = async (email, name, phone, randPassword) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.PIRO_MAIL,
      pass: process.env.PIRO_MAIL_KEY,
    },
  });

  const htmlBody = createHTML(name, phone, randPassword);
  try {
    const info = await transporter.sendMail({
      from: process.env.PIRO_MAIL,
      to: email,
      subject: "[피로그래밍 어플 회원 정보]",
      html: htmlBody,
      attachments: [{
        filename: 'logo.png',
        path: __dirname + '/../public/images/logo.png',
        cid: 'unique@nodemailer.com',
      }]
    });
    console.log("Message sent: %s", info.messageId);
    return { result: true };
  } catch (error) {
    console.log(error);
    return { result: false };
  }
}