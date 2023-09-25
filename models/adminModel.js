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
  },
  addCouponToUser: async (couponData) => {
    const query =`
    INSERT INTO Coupon(user_id, type, money)
    VALUES(?, ?, ?);`; //is_used는 default 0임

    const result = await db.query(query, [couponData.user_id, couponData.type, couponData.money]);
    
    return result[0];
  },
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
  getOneUserInfo: async (requestUser) => {
    const query = `
    SELECT user_id, level, name, email, phone, deposit, created_at
    FROM User
    WHERE user_id=?;`;
    const oneUserInfo = await db.query(query, [requestUser.user_id]);

    return oneUserInfo[0][0];
  }
}