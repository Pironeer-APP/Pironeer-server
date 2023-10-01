const db = require('../config/db.js');

module.exports = {
  getUserInfo: async (level) => {
    const query = `
    SELECT user_id, level, name, email, phone, deposit, created_at
    FROM User
    WHERE level=?;`;

    // admin의 level이 넘어옴. admin의 level 기수들 정보만 가져오기
    const userInfoList = await db.query(query, [level]);

    return userInfoList[0];
  },
  addCouponToUser: async (couponData) => {
    const query =`
    INSERT INTO Coupon(user_id, type, money)
    VALUES(?, "보증금 방어권", 10000);`; //is_used는 default 0임

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