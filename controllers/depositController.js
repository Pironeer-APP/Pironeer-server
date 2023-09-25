const depositModel = require('../models/depositModel.js');

module.exports = {
  viewDeposit: async (req,res) => {
    const userId = req.params.user_id;
    const deposit = await depositModel.getDeposit(userId);
    const assignments = await depositModel.getAssignments(userId);
    const coupons = await depositModel.getCoupons(userId);
    res.json({deposit: deposit, assignments: assignments, coupons: coupons});    
  }
}