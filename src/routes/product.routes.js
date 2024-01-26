const {authJwt} = require('../middlewares');
const ProductControllers = require('../controllers/product.controller');

const API_VERSION = '/api/v1';
const API_TAG = 'product';

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
   * /api/v1/product/add:
   *   post:
   *     summary: Add a new Product
   *     description: Create a new Product with the provided details.
   *     tags:
   *       - Product
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: name of the Product
   *               description:
   *                 type: string
   *                 description: Description of the Product
   *               organizationId:
   *                 type: string
   *                 description: ID of the organization
   *     responses:
   *       '200':
   *         description: Product added successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Forbidden, user not allowed to add a Product
   */
  app.post(
      `${API_VERSION}/${API_TAG}/add`,
      [
        authJwt.verifyToken,
      ],
      ProductControllers.addProduct,
  );
};
