const authModel = require('../models/authModel.js');

module.exports = {
  login: async (req, res) => {
    const data = await authModel.login();

    res.send(data);
  }
}