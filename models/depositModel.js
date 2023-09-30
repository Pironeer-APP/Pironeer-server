const db = require('../config/db.js');

module.exports = {
  getDepositHistory: async (userInfo) => {
    const attendAndAssignQuery = `
    SELECT *, @SEQ := @SEQ+1 AS SEQ,
      CASE
        WHEN type = '결석' THEN 20000
        WHEN type = '지각' THEN 10000
        WHEN type = 0 THEN 20000
        WHEN type = 1 THEN 10000
      END AS price
    FROM (
      SELECT type, created_at, DATE_FORMAT(created_at, '%m-%d') AS monthDay
      FROM Attend
      WHERE user_id=?
      UNION
      SELECT grade AS type, created_at, DATE_FORMAT(created_at, '%m-%d') AS monthDay
      FROM Assign
      WHERE user_id=?
      ORDER BY created_at
    ) AS B, (SELECT @SEQ := 0) A;`;
    const historyList = await db.query(attendAndAssignQuery, [userInfo.user_id, userInfo.user_id]);

    return historyList[0];
  },
  getCoupons: async (userInfo) => {
    const query = `SELECT * FROM Coupon WHERE user_id=?;`;
    const couponInfoList = await db.query(query, [userInfo.user_id]);
    return couponInfoList[0];
  },
}