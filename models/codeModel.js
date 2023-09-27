const db = require('../config/db.js');

module.exports = {
  viewCode: async () => {
    const query = 'SELECT * FROM Code';
    const codes = await db.query((query));
    return codes[0];
  },
  generateCode: async () => {
    const randomCode = Math.floor(Math.random()*9000+1000); //1000과 9999사이 
    console.log (randomCode)
    const query = 'INSERT INTO Code(code) VALUES (?)'
    await db.query((query),[randomCode]);
  },
  removeCode: async () => {
    const query = 'DELETE FROM Code';
    const result = await db.query(query);
    return result;
  },
}