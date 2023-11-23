const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = {
  getUrl: async (req, res) => {
    const {userToken} = req.body;
    try {
      const userInfo = jwt.verify(userToken, process.env.JWT);
      const user = await userModel.getOneUserInfo(userInfo.user_id);
      if(user) {
        return res.json({url: process.env.CURRI_URL});
      } else {
        return res.json({url: ''});
      }
    } catch(error) {
      console.log('can not get curriculum url..', error);
      return res.json({url: ''});
    }
  }
}