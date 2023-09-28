const db = require('../config/db.js');

module.exports = {
  getOneUserInfo: async (user_id) => {
    const query = `
    SELECT *
    FROM User
    WHERE user_id=?;`;
    const oneUserInfo = await db.query(query, [user_id]);

    return oneUserInfo[0][0];
  },
  getUserByPhone: async (phone) => {
    const query = `
    SELECT *
    FROM User
    WHERE phone=?;`;
    const userInfo = await db.query(query, [phone]);

    return userInfo[0][0];
  }
}