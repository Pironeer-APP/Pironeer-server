const adminModel = require('../models/adminModel.js');
const jwt = require('jsonwebtoken');

module.exports = {
  getUserInfo: async (req, res) => {
    const adminToken = req.body.token;
    try {
      const adminInfo = jwt.verify(adminToken, process.env.JWT);
      if(adminInfo.is_admin) {
        const userInfoList = await adminModel.getUserInfo(adminInfo.level);
        res.json({userInfoList: userInfoList});
      } else {
        res.json({userInfoList: null});
      }
    } catch(error) {
      console.log(error);
      res.json({userInfoList: null});
    }
  },
}