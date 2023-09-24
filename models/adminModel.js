const db = require('../config/db.js');

module.exports = {
  getUserInfo: async (level) => {
    const query = `
    SELECT user_id, level, name, email, phone, deposit, created_at
    FROM User
    WHERE level=?;`;

    // admin의 level이 넘어옴. admin의 level보다 1 큰 후배 기수들 정보만 가져오기
    const userInfoList = await db.query(query, [level + 1]);

    return userInfoList[0];
  }
}