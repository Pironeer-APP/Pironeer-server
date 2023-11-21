const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const userModel = require('./userModel.js');
const salt = 10;

module.exports = {
  login: async (loginData) => {
    const query = `
    SELECT *
    FROM User
    WHERE phone=?;`;
    const userData = await db.query(query, [loginData.phone]);
    const userInfo = userData[0][0];
    try {
      const match = await bcrypt.compare(loginData.password, userInfo.password);
      if(match) {
        return userInfo;
      } else {
        return false;
      }
    } catch(error) {
      return false;
    }
  },
  findAccount: async (phone, newPassword) => {
    const query = `
    UPDATE User
    SET password=?
    WHERE phone=?;`;
    try {
      const hash = await bcrypt.hash(newPassword, salt);
      const result = await db.query(query, [hash, phone]);

      return result[0];
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
  compareInfo: async (data, type, requestUserInfo) => {
    if(type === 'phone') {
      return requestUserInfo.phone === data;
    } else if(type === 'email') {
      return requestUserInfo.email === data;
    } else if(type === 'password') {
      const match = await bcrypt.compare(data, requestUserInfo.password);
      return match;
    }
  },
  updatePhone: async (data, user_id) => {
    const query = `
    UPDATE User
    SET phone=?
    WHERE user_id=?;`;

    try {
      const result = await db.query(query, [data, user_id]);
      return result[0];
    } catch {
      return false;
    }
  },
  updatePassword: async (data, user_id) => {
    const query = `
    UPDATE User
    SET password=?
    WHERE user_id=?;`;

    try {
      const hash = await bcrypt.hash(data, salt);
      const result = await db.query(query, [hash, user_id]);
      return result[0];
    } catch(error) {
      console.log(error);
      return false;
    }
  },
  updateEmail: async (data, user_id) => {
    const query = `
    UPDATE User
    SET email=?
    WHERE user_id=?;`;

    try {
      const result = await db.query(query, [data, user_id]);
      return result[0];
    } catch {
      return false;
    }
  },
  updateLevel: async (data, user_id) => {
    const query = `
    UPDATE User
    SET level=?
    WHERE user_id=? AND is_admin=1;`;

    try {
      const result = await db.query(query, [data, user_id]);
      return result[0];
    } catch(error) {
      console.log(error);
      return false;
    }
  },
  unregister: async (user_id) => {
    const query = `DELETE FROM User WHERE user_id=?;`;
    
    try {
      const result = await db.query(query, [user_id]);
      return result[0];
    } catch(error) {
      console.log(error);
      return false;
    }
  }
}