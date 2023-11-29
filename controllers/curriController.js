const authModel = require('../models/authModel.js');

module.exports = {
  getUrl: async (req, res) => {
    const userInfo = req.body.account;
    const user = await authModel.getAccount(userInfo.user_id);
    if (user) {
      return res.json({ url: process.env.CURRI_URL });
    } else {
      return res.json({ url: '' });
    }
  }
}