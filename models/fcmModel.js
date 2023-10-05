const db = require('../config/db.js');

module.exports = {
  saveToken: async (token) => {
    // Token이 있으면 update
    const searchToken = 'SELECT * FROM DeviceToken WHERE token=?;';
    const tokenHere = await db.query(searchToken, [token]);
    if(tokenHere[0].length) {
      const updateToken = 'UPDATE DeviceToken SET updated_at=NOW() WHERE token=?;';
      const result = await db.query(updateToken, [token]);
      console.log(result);
      return result[0];
    }
    const query = 'INSERT INTO DeviceToken(token) VALUES(?);';
    const result = await db.query(query, [token]);
    console.log(result);

    return result[0];
  },
  getTokens: async () => {
    const query = 'SELECT token FROM DeviceToken;';
    const result = await db.query(query);

    return result[0];
  }
}