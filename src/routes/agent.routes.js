const {verifySignUp, authJwt} = require('../middlewares');
const AgentControllers = require('../controllers/agent.controller');

const API_VERSION = '/api/v1';
const API_TAG = 'agent';

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  /**
   * @swagger
   * /api/v1/agent/add:
   *   post:
   *     summary: Add agent
   *     description: Create a new agent user for organization.
   *     tags:
   *       - Agent
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
   *               confirm:
   *                 type: string
   *                 description: confirm the password
   *     responses:
   *       '200':
   *         description: User account created successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '500':
   *         description: Internal Server Error, an error occurred while creating the user account
   */
  app.post(
      `${API_VERSION}/${API_TAG}/add`,
      [
        verifySignUp.checkDuplicateUsernameOrEmail,
        authJwt.verifyToken,
      ],
      AgentControllers.addAgent,
  );
};
