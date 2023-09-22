const db = require('../config/db.js');

module.exports = {
  login: async () => {
    const query = 'SELECT * FROM User;';
    const userData = await db.query(query);
    return userData[0];
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