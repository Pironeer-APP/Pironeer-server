const fcmModel = require("../models/fcmModel");

const admin = require("firebase-admin");

module.exports = {
  push: async(req, res) => {
    const tokens = await fcmModel.getTokens();
    let tokenList = [];
    tokens.forEach((token) => {
      tokenList.push(token.token);
    });
    // 나를 제외한 기기들에게 알림
    const idx = tokenList.indexOf(req.body.myToken);
    if (idx > -1) tokenList.splice(idx, 1);
    
    if(tokenList.length) {
      const message = {
        notification: {
          title: req.body.title,
          body: req.body.body
        },
        tokens: tokenList
      };
    
      // Send a message to devices subscribed to the provided topic.
      admin.messaging().sendEachForMulticast(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    } else {
      res.json({});
    }
  },
  saveToken: async (req, res) => {
    const token = req.body.token;
    console.log(token);
    await fcmModel.saveToken(token);
    res.json({result: true});
  }
}