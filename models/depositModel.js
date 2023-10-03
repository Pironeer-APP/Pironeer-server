const db = require('../config/db.js');

module.exports = {
  getDepositHistory: async (userInfo) => {
    const attendAndAssignQuery = `
    SELECT *, ROW_NUMBER() OVER (ORDER BY date) AS CNT,
      CASE
        WHEN type = '결석' THEN -20000        
        WHEN type = '지각' THEN -10000
        WHEN type = 0 THEN -20000
        WHEN type = 1 THEN -10000
        WHEN type = '보증금 방어권' THEN +10000
      END AS price
    FROM (
      SELECT type, created_at as date, DATE_FORMAT(created_at, '%m.%d') AS monthDay
      FROM Attend
      WHERE user_id=?
      UNION
      SELECT grade AS type, created_at as date, DATE_FORMAT(created_at, '%m.%d') AS monthDay
      FROM Assign
      WHERE user_id=?
      UNION 
      SELECT type, updated_at as date, DATE_FORMAT(updated_at,'%m.%d') AS monthDay
      FROM Coupon
      WHERE user_id=? AND is_used =?
    ) AS B
    ORDER BY date;`;
    const historyList = await db.query(attendAndAssignQuery, [userInfo.user_id, userInfo.user_id, userInfo.user_id, 1]);
    return historyList[0];
  },
  getCoupons: async (userInfo) => {
    const query = `SELECT * FROM Coupon WHERE user_id=? AND is_used=?;`;
    const couponInfoList = await db.query(query, [userInfo.user_id,0]);
    return couponInfoList[0];
  },
  addCouponToUser: async (couponData) => {
    const query =`
    INSERT INTO Coupon(user_id, type)
    VALUES(?, "보증금 방어권");`; //is_used는 default 0임

    const result = await db.query(query, [couponData.user_id]);
    
    return result[0];
  },
  deleteCoupon: async (coupon_id) => {
    const query = 'DELETE FROM Coupon WHERE coupon_id=?;';
    try {
      await db.query(query, [coupon_id]);
      return true;
    } catch(error) {
      console.log(error);
      return false;
    }
  }
}