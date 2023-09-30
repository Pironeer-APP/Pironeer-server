const db = require('../config/db.js');

module.exports = {
  getDepositHistory: async (userInfo) => {
    const attendAndAssignQuery = `
    SELECT *, @SEQ := @SEQ+1 AS SEQ,
      CASE
        WHEN type = '결석' THEN '-20000'        
        WHEN type = '지각' THEN '-10000'
        WHEN type = 0 THEN -20000
        WHEN type = 1 THEN -10000
        WHEN type = '10000원 쿠폰' THEN '+10000'
        WHEN type = '20000원 쿠폰' THEN '+20000'
      END AS price
    FROM (
      SELECT type, created_at as date, DATE_FORMAT(created_at, '%m-%d') AS monthDay
      FROM Attend
      WHERE user_id=?
      UNION
      SELECT grade AS type, created_at as date, DATE_FORMAT(created_at, '%m-%d') AS monthDay
      FROM Assign
      WHERE user_id=?
      UNION 
      SELECT type, used_at as date, DATE_FORMAT(used_at,'%m-%d') AS monthDay
      FROM Coupon
      WHERE user_id=? AND used_at IS NOT NULL
      ORDER BY date
    ) AS B, (SELECT @SEQ := 0) A;`;
    const historyList = await db.query(attendAndAssignQuery, [userInfo.user_id, userInfo.user_id, userInfo.user_id]);

    return historyList[0];
  },
  getCoupons: async (userInfo) => {
    const query = `SELECT * FROM Coupon WHERE user_id=? AND used_at IS NULL;`;
    const couponInfoList = await db.query(query, [userInfo.user_id]);
    console.log(userInfo)
    console.log(couponInfoList);
    return couponInfoList[0];
  },
  createCoupon: async (userInfo) => {
    const query = `INSERT INTO Coupon (user_id,type) VALUES (?,10000원 쿠폰)`;
    await db.query(query, [userInfo.user_id,'10000원 쿠폰']);
  },
  deleteCoupon: async (userInfo) => {
    const query = `DELETE FROM Coupon WHERE user_id=? ORDER BY coupon_id DESC LIMIT 1;`;
    await db.query(query, [userInfo.user_id])
  },
}