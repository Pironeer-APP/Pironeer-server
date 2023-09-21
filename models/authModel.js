const db = require('../config/db.js');

module.exports = {
  login: async () => {
    const query = 'SELECT * FROM User;';
    const userData = await db.query(query);
    return userData[0];
  }
}