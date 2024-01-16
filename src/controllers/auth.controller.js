const AuthServices = require('../services/auth.services');

signup = async (req, res) => {
  await AuthServices.signup(req, res);
};

signupOrganization = async (req, res) => {
  await AuthServices.signupOrganization(req, res);
};

signin = async (req, res) => {
  await AuthServices.signIn(req, res);
};

const AuthControllers = {
  signup,
  signupOrganization,
  signin,
};

module.exports = AuthControllers;
