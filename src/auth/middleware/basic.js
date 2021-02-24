'use strict';

const base64 = require('base-64');
const User = require('../models/users.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { next('Invalid Login') /*_authError()'Auth Error'*/; }

  let basic = req.headers.authorization.split(' ');
  // console.log('basic', basic);
  let encodedString = basic.pop();
  let decodedString = base64.decode(encodedString);
  let [user, pass] = decodedString.split(':');

  try {
    let validUser = await User.authenticateBasic(user, pass);
    if(validUser) {
      req.user = validUser;
      req.token = validUser.token;
      // console.log('THIS IS', req.user);
      next();
    } else {
      next('Invalid User');
    }
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

};
