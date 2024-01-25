const {authJwt} = require("../middlewares");
const InformationControllers = require("../controllers/information.controller");

const API_VERSION = "/api/v1";
const API_TAG = "information";

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
     * /api/v1/information/organization/{id}:
     *   get:
     *     summary: User Signup
     *     description: Create a new user account.
     *     tags:
     *       - Information
     *     parameters:
     *       - in: path
     *         name: id
     *         description: ID of the organization to see
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: User account created successfully
     *       '400':
     *         description: Bad request, check the request payload
     *       '500':
     *         description: Internal Server Error, an error occurred while creating the user account
     */
    app.get(
        `${API_VERSION}/${API_TAG}/organization/:id`,
        [
            authJwt.verifyToken,
        ],
        InformationControllers.organizationInformation
    );
};