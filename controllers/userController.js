const userModel = require('../models/userModel.js');

module.exports = {
  getOneUserInfo: async (req, res) => {
    const requestUser = req.body;
    const oneUserInfo = await userModel.getOneUserInfo(requestUser);

    console.log(oneUserInfo);
    res.json({oneUserInfo: oneUserInfo});
  }
}