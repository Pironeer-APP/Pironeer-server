const db = require('../config/db.js')

module.exports = {
  getDeposit: async (userId) => {
    const query = `SELECT * FROM User WHERE user_id=?`;
    const deposit = await db.query(query,[userId]);
    return deposit[0][0].deposit
  },
  getAssignments: async (userId) => {
    const query= `SELECT * FROM Assign WHERE user_id=? AND grade!=?`;  //36번 
    const assignments = await db.query(query,[userId,3])
    return assignments[0]
  },
  getCoupons: async (userId) => {
    const query= `SELECT * FROM Coupon WHERE user_id=? AND is_used`;  //36번 
    const coupons = await db.query(query,[36])
    return coupons[0]    
  },

}