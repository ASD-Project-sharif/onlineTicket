const {verifySignUp} = require("../middlewares");
const AuthControllers = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    /**
     * @swagger
     * /api/v1/auth/signup/user:
     *   post:
     *     summary: User Signup
     *     description: Create a new user account.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: The user's name to show
     *               username:
     *                 type: string
     *                 description: The username for the new user account
     *               email:
     *                 type: string
     *                 description: The email address for the new user account
     *               password:
     *                 type: string
     *                 description: The password for the new user account
     *     responses:
     *       '200':
     *         description: User account created successfully
     *       '400':
     *         description: Bad request, check the request payload
     *       '500':
     *         description: Internal Server Error, an error occurred while creating the user account
     */
    app.post(
        "/api/v1/auth/signup/user",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        AuthControllers.signup
    );

    /**
     * @swagger
     * /api/v1/auth/signup/organization:
     *   post:
     *     summary: Organization Signup
     *     description: Create a new organization account.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               organizationName:
     *                 type: string
     *                 description: The name of the organization
     *               organizationDescription:
     *                 type: string
     *                 description: The Description of the organization
     *               username:
     *                 type: string
     *                 description: The username for the new organization account
     *               email:
     *                 type: string
     *                 description: The email address for the new organization account
     *               password:
     *                 type: string
     *                 description: The password for the new organization account
     *     responses:
     *       '200':
     *         description: Organization account created successfully
     *       '400':
     *         description: Bad request, check the request payload
     *       '500':
     *         description: Internal Server Error, an error occurred while creating the organization account
     */
    app.post(
        "/api/v1/auth/signup/organization",
        [
            verifySignUp.checkDuplicateOrganizationName,
            verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        AuthControllers.signupOrganization
    );

    /**
     * @swagger
     * /api/v1/auth/signin:
     *   post:
     *     summary: User Signin
     *     description: Authenticate and sign in a user.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: The username for user
     *               password:
     *                 type: string
     *                 description: The password for user
     *     responses:
     *       '200':
     *         description: a new User created successfully
     *       '400':
     *         description: Bad request, check the request payload
     *       '500':
     *         description: Internal Server Error, an error occurred
     */
    app.post(
        "/api/v1/auth/signin",
        [],
        AuthControllers.signin
    );
};