const nodemailer = require("nodemailer");
const createHTML = require('../nodemailer/createHTML.js');
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const OAuth2 = google.auth.OAuth2;
// node mailer
const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URL(Optional)
);

oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

module.exports = async (email, name, phone, randPassword) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.OAUTH_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken
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