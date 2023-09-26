const db = require('../config/db.js');

module.exports = {
  getOneUserInfo: async (requestUser) => {
    const query = `
    SELECT user_id, level, name, email, phone, deposit, created_at
    FROM User
    WHERE user_id=?;`;
    const oneUserInfo = await db.query(query, [requestUser.user_id]);

    return oneUserInfo[0][0];
  }
}