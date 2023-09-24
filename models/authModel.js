const db = require('../config/db.js');

module.exports = {
  login: async (loginData) => {
    const query = `
    SELECT
      level, is_admin, password,
      name, email, phone, deposit, created_at
    FROM User
    WHERE phone=?;`; //async storage에 저장될 예정이므로 필요한 정보만 가져오기
    const userData = await db.query(query, [loginData.phone]);
    const userInfo = userData[0][0];
    console.log(userInfo);
    try {
      if(userInfo.password === loginData.password) return userInfo;
      else return false;
    } catch(error) {
      return false;
    }
  },
  addUser: async (newUserData, randPassword) => {
    const query = 'INSERT INTO User(level, name, phone, password, email, deposit) VALUES(?, ?, ?, ?, ?, ?);';

    try {
      await db.query(query, [
        newUserData.level,
        newUserData.name,
        newUserData.phone,
        randPassword,
        newUserData.email,
        120000
      ]);
      return true;
    } catch(error) {
      console.log(error);
      return false;
    }
  }
}