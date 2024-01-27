const jwt = require('jsonwebtoken');
const UserRepository = require('../repository/user.repository');

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({message: 'No token provided!'});
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).send({message: 'Unauthorized!'});
    }

    const userExist = await UserRepository.hasUserExist(decoded.id);
    if (!userExist) {
      return res.status(401).send({message: 'Unauthorized!'});
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
