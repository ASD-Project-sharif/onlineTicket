const jwt = require('jsonwebtoken');

const generateToken = (userID) => {
  return jwt.sign({id: userID},
      process.env.SECRET_KEY,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });
};

module.exports = {
  generateToken,

};
