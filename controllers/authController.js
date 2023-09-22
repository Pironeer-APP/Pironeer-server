const authModel = require('../models/authModel.js');

module.exports = {
  login: async (req, res) => {
    const data = await authModel.login();

    res.send(data);
  },
  addUser: async (req, res) => {
    const newUserData = req.body;
    const result = await authModel.addUser(newUserData);

    res.json({result: result});
  }
}