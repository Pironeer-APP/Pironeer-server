const db = require('../config/db.js');

module.exports = {
    codeGeneration: async (level) => {
      const randomCode = Math.floor(Math.random() * 10000);

      const query1 = 'INSERT INTO Code (code) Values (?);'
      const code1 = await db.query(query1,[randomCode]);

      const query2 = 'Select * From Code'
      const code2 = await db.query(query2,[code1.insertId]);
      return code2[0];
    },
}