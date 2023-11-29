const adminModel = require('../models/adminModel.js');

module.exports = {
  getUserInfo: async (req, res) => {
    const adminInfo = req.body.account;
    if(adminInfo.is_admin) {
      const userInfoList = await adminModel.getUserInfo(adminInfo.level);
      res.json({userInfoList: userInfoList});
    } else {
      res.json({userInfoList: null});
    }
  },
}