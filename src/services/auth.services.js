const UserRepository = require('../repository/user.repository');
const OrganizationRepository = require('../repository/organization.repository');
const UserRole = require('../models/enums/userRoles.enum');
const PasswordServices = require('./password.services');
const TokenServices = require('./token.services');

signup = async (req, res) => {
  if (!PasswordServices.isPasswordDifficultEnough(req.body.password)) {
    res.status(400).send({message: 'password is not difficult enough!'});
    return;
  }
  if (req.body.password !== req.body.confirm) {
    res.status(400).send({message: 'passwords are different!'});
    return;
  }

  const user = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: PasswordServices.getPasswordHash(req.body.password),
    role: UserRole.USER,
  };
  await UserRepository.createNewUser(user);
  res.send({message: 'User was registered successfully!'});
};

signupOrganization = async (req, res) => {
  if (!PasswordServices.isPasswordDifficultEnough(req.body.password)) {
    res.status(400).send({message: 'password is not difficult enough!'});
    return;
  }
  const organizationData = {
    name: req.body.organizationName,
    description: req.body.organizationDescription,
  };
  const organization = await OrganizationRepository.createNewOrganization(organizationData);
  const organizationUser = {
    username: req.body.username,
    email: req.body.email,
    password: PasswordServices.getPasswordHash(req.body.password),
    organization: organization._id,
    role: UserRole.ADMIN,
  };

  const admin = await UserRepository.createNewUser(organizationUser);

  organization.admin = admin._id;
  await OrganizationRepository.editOrganization(organization._id, organization);
  res.send({message: 'Admin was registered successfully!'});
};

signIn = async (req, res) => {
  const user = await UserRepository.getByUsername(req.body.username);
  if (!user) {
    return res.status(400).send({message: 'User and Password combination is incorrect.'});
  }
  const passwordIsValid = PasswordServices.arePasswordsEqual(req.body.password, user.password);
  if (!passwordIsValid) {
    return res.status(400).send({message: 'User and Password combination is incorrect.'});
  }

  const authority = 'ROLE_' + user.role.toUpperCase();
  res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    role: authority,
    accessToken: TokenServices.generateToken(user.id),
  });
};

const AuthServices = {
  signup,
  signupOrganization,
  signIn,
};

module.exports = AuthServices;
