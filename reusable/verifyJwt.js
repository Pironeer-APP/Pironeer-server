const jwt = require('jsonwebtoken');
const { getAccount } = require('../models/authModel');

module.exports = {
  verifyJwt: async (jwtToken) => {
    try {
      const jwtObj = jwt.verify(jwtToken, process.env.JWT);
      const account = await getAccount(jwtObj.user_id);
      if(account === null) console.log(`cant find account ${jwtObj.user_id}`);
      return account;
    } catch (error) {
      console.log('jwt verify error!!!', error);
      return false;
    }
  }
}