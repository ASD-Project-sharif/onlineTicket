const { verifySignUp } = require("../middlewares");
const AuthControllers = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/v1/auth/signup/user",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        AuthControllers.signup
    );

    app.post(
        "/api/v1/auth/signup/organization",
        [
            verifySignUp.checkDuplicateOrganizationName,
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        AuthControllers.signupOrganization
    );

    app.post("/api/v1/auth/signin", AuthControllers.signin);
};