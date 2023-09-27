const codeModel = require('../models/codeModel.js');

module.exports = {
  viewCode: async(req,res) => {
    const codes = await codeModel.viewCode();
    res.json({codes: codes});
  },
  generateCode: async (req, res) => {
    await codeModel.generateCode();
    res.redirect('/api/code');
  },
  removeCode: async (req, res) => {
    const result = await codeModel.removeCode();
    res.json({result: result}) ;
  },
}