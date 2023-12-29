const {AuthServices} = require("../services/auth.services")

signup = async (req, res) => {
    AuthServices.signup(req);
};

signupOrganization = async (req, res) => {
    AuthServices.signupOrganization(req);
};

signin = async (req, res) => {
    AuthServices.signIn(req, res);
};

const AuthControllers = {
    signup,
    signupOrganization,
    signin
}

module.exports = AuthControllers;