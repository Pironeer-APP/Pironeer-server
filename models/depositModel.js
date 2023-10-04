const db = require('../config/db.js');

module.exports = {
  getDepositHistory: async (userInfo) => {
    const attendAndAssignQuery = `
      SELECT *, ROW_NUMBER() OVER (ORDER BY date) AS CNT,
        CASE
          WHEN type = '결석' THEN -20000        
          WHEN type = '지각' THEN -10000
          WHEN type = '보증금 방어권' THEN +10000
          WHEN type = '과제 미제출' THEN -20000
          WHEN type = '과제 지각' THEN -10000
          WHEN type = '과제 미제출' THEN -10000
        END AS price
      FROM (
        SELECT
          CASE
            WHEN grade = 0 THEN '과제 미제출'
            WHEN grade = 1 THEN '과제 지각'
            WHEN grade = 2 THEN '과제 미흡'
          END AS type,
          created_at AS date,
          DATE_FORMAT(created_at, '%m.%d') AS monthDay
        FROM Assign
        WHERE user_id=? AND NOT grade = 3 
        UNION 
        SELECT type, created_at AS date, DATE_FORMAT(created_at, '%m.%d') AS monthDay
        FROM Attend
        WHERE user_id=?
        UNION 
        SELECT type, updated_at AS date, DATE_FORMAT(updated_at, '%m.%d') AS monthDay
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
  },
  useCoupon:  async (user_id) => {
    const useCouponQuery = `UPDATE Coupon AS c1
    SET is_used = 1
    WHERE coupon_id = (
        SELECT coupon_id
        FROM (
            SELECT coupon_id
            FROM Coupon
            WHERE user_id = ?
            AND is_used = 0
            ORDER BY updated_at
            LIMIT 1
        ) AS c2
    );`;
    await db.query(useCouponQuery,[user_id]);
    const updateDepositQuery = `UPDATE User SET 
    deposit = deposit + 10000 WHERE user_id = ?`;
    await db.query(updateDepositQuery, [user_id]);
    const check = `SELECT * FROM User WHERE user_id = 44`;
    // const user = await db.query(check);
    // console.log('asdfasdf')
    // console.log(user[0][0].deposit);
  },
  updateExcessCoupon: async (user_id, cnt) => {
    const query = `
    UPDATE Coupon
    SET is_used=0
    WHERE coupon_id IN (
      SELECT * FROM (
        SELECT coupon_id
        FROM Coupon
        WHERE user_id=? AND is_used=1
        ORDER BY updated_at
        LIMIT ?
      ) AS t
    );`;
    try {
      await db.query(query, [user_id, cnt]);
      return true;
    } catch(error) {
      console.log('[보증금 방어권 사용 취소 실패]', error);
      return false;
    }
  }
}