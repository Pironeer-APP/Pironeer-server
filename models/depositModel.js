const db = require('../config/db.js')

module.exports = {
  getDeposit: async (userId) => {
    const query = `SELECT * FROM User WHERE user_id=?`;
    const deposit = await db.query(query,[userId]);
    return deposit[0][0].deposit
  }
}