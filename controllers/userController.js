const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

module.exports = {
  getOneUserInfo: async (req, res) => {
    const requestUser = req.body.userToken;
    console.log(requestUser);
    try {
      const decoded = jwt.verify(requestUser, process.env.JWT);
      console.log(decoded);
      res.json({oneUserInfo: decoded});
    } catch(error) {
      res.json(null);
    }
  }
}