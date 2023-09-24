const adminModel = require('../models/adminModel.js');

module.exports = {
  getUserInfo: async (req, res) => {
    const adminLevel = req.body.level;
    const userInfoList = await adminModel.getUserInfo(adminLevel);

    res.json({userInfoList: userInfoList});
  }
}