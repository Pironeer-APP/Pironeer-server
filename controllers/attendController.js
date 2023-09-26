const attendModel = require('../models/attendModel.js');

module.exports = {
  codeGeneration: async (req, res) => {
    const code = await attendModel.codeGeneration();
    res.json({code: code});
  },
}