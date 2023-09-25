const depositModel = require('../models/depositModel.js');

module.exports = {
  viewDeposit: async (req,res) => {
    const userId = req.params.user_id;
    const data = await depositModel.getDeposit(userId);
    res.json({data: data});    
  }
}