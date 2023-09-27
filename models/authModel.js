const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const userModel = require('./userModel.js');
const salt = 10;

module.exports = {
  login: async (loginData) => {
    const query = `
    SELECT user_id, level, is_admin, password, name, email, phone, deposit, created_at
    FROM User
    WHERE phone=?;`;
    const userData = await db.query(query, [loginData.phone]);
    const userInfo = userData[0][0];
    console.log(userInfo);
    try {
      const match = await bcrypt.compare(loginData.password, userInfo.password);
      if(match) {
        return {
          user_id: userInfo.user_id,
          level: userInfo.level,
          is_admin: userInfo.is_admin,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          deposit: userInfo.deposit,
          created_at: userInfo.created_at
        }; //async storage에 저장될 예정이므로 필요한 정보만 가져오기
      } else {
        return false;
      }
    } catch(error) {
      return false;
    }
  },
  addUser: async (newUserData, randPassword) => {
    const query = 'INSERT INTO User(level, name, phone, password, email, deposit) VALUES(?, ?, ?, ?, ?, ?);';

    try {
      const hash = await bcrypt.hash(randPassword, salt);
      await db.query(query, [
        newUserData.level,
        newUserData.name,
        newUserData.phone,
        hash,
        newUserData.email,
        120000
      ]);
      return true;
    } catch(error) {
      console.log(error);
      return false;
    }
  },
  compareInfo: async (data, type) => {
    const userInfo = await userModel.getUserFullInfo(data);
    if(type === 'phone') {
      return userInfo.phone === data.type;
    } else if(type === 'email') {
      return userInfo.email === data.type;
    } else if(type === 'password') {
      const match = await bcrypt.compare(data.type, userInfo.password);
      return match;
    }
  },
  updatePhone: async (data) => {
    const query = `
    UPDATE User
    SET phone=?
    WHERE user_id=?;`;

    try {
      const result = await db.query(query, [data.type, data.user_id]);
      return result[0];
    } catch {
      return false;
    }
  },
  updatePassword: async (data) => {
    const query = `
    UPDATE User
    SET password=?
    WHERE user_id=?;`;

    try {
      const hash = await bcrypt.hash(data.type, salt);
      const result = await db.query(query, [hash, data.user_id]);
      return result[0];
    } catch(error) {
      console.log(error);
      return false;
    }
  },
  updateEmail: async (data) => {
    const query = `
    UPDATE User
    SET email=?
    WHERE user_id=?;`;

    try {
      const result = await db.query(query, [data.type, data.user_id]);
      return result[0];
    } catch {
      return false;
    }
  },
}