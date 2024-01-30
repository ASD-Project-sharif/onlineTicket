const {authJwt} = require('../middlewares');
const SuspendedUserControllers = require('../controllers/suspendedUser.controller');

const API_VERSION = '/api/v1';
const API_TAG = 'suspended-user';

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
   * /api/v1/suspended-user:
   *   post:
   *     summary: Suspend User
   *     description: Ban or UnBan a user.
   *     tags:
   *       - SuspendUser
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 description: id of user
   *               suspend:
   *                 type: boolean
   *                 description: ban or un-ban the user
   *     responses:
   *       '200':
   *         description: Success
   *       '304':
   *         description: Not-Modified
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Forbidden, user not allowed
   */
  app.post(
      `${API_VERSION}/${API_TAG}`,
      [
        authJwt.verifyToken,
      ],
      SuspendedUserControllers.suspendUser,
  );
};
