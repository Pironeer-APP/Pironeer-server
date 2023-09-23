const db = require('../config/db.js');

module.exports = {
  login: async (loginData) => {
    const query = 'SELECT * FROM User WHERE phone=?;';
    const userData = await db.query(query, [loginData.phone]);
    const userInfo = userData[0][0];
    try {
      if(userInfo.password === loginData.password) return userInfo;
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