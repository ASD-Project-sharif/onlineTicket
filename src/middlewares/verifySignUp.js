const {findOneDocument} = require('../dataAccess/dataAccess');
db = require('../models');

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const userByUsername = await findOneDocument('User',
      {username: req.body.username});
  if (userByUsername) {
    res.status(400).send({message: 'Failed! Username is already in use!'});
    return;
  }

  if (!isValidEmail(req.body.email)) {
    res.status(400).send({message: 'Bad Email Provided!'});
    return;
  }

  const userByEmail = await findOneDocument('User', {email: req.body.email});
  if (userByEmail) {
    res.status(400).send({message: 'Failed! Email is already in use!'});
    return;
  }
  next();
};

checkDuplicateOrganizationName = async (req, res, next) => {
  const organization = await findOneDocument('Organization',
      {name: req.body.organizationName});
  if (organization) {
    res.status(400).
        send({message: 'Failed! OrganizationName is already in use!'});
    return;
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateOrganizationName,
};

module.exports = verifySignUp;
