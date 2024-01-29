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

  /**
   * @swagger
   * /api/v1/product/edit/{id}:
   *   post:
   *     summary: Edit a Product by ID
   *     description: Edit an existing product using its unique identifier.
   *     tags:
   *       - Product
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the product to be edited
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: New name for the product
   *               description:
   *                 type: string
   *                 description: New description for the product
   *     responses:
   *       '200':
   *         description: Product edited successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid, or you do nor have access to edit
   */
  app.post(
      `${API_VERSION}/${API_TAG}/edit/:id`,
      [
        authJwt.verifyToken,
      ],
      ProductControllers.editProduct,
  );

  /**
   * @swagger
   * /api/v1/product/delete/{id}:
   *   post:
   *     summary: Delete a Product
   *     description: Delete a Product with the provided ID.
   *     tags:
   *       - Product
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the product to be deleted
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Product deleted successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Forbidden, user not allowed to delete a Product
   */
  app.post(
      `${API_VERSION}/${API_TAG}/delete/:id`,
      [
        authJwt.verifyToken,
      ],
      ProductControllers.deleteProduct,
  );

  /**
   * @swagger
   * /api/v1/product/organization/{id}:
   *   get:
   *     summary: Get organization products
   *     description: Get products associated with id.
   *     tags:
   *       - Product
   *     parameters:
   *       - in: query
   *         name: id
   *         description: id of organization
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Success
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid
   */
  app.get(
      `${API_VERSION}/${API_TAG}/organization/:id`,
      [
        authJwt.verifyToken,
      ],
      ProductControllers.getOrganizationProductsById,
  );

  /**
   * @swagger
   * /api/v1/product/organization:
   *   get:
   *     summary: Get organization products
   *     description: Get product associated with the organization of agent/admin
   *     tags:
   *       - Product
   *     responses:
   *       '200':
   *         description: Success
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid
   */
  app.get(
      `${API_VERSION}/${API_TAG}/organization`,
      [
        authJwt.verifyToken,
      ],
      ProductControllers.getOrganizationProductsByAgent,
  );

  /**
   * @swagger
   * /api/v1/product/{id}:
   *   get:
   *     summary: Get Product
   *     description: Get Product with id.
   *     tags:
   *       - Product
   *     parameters:
   *       - in: query
   *         name: id
   *         description: id of Product
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Success
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid
   */
  app.get(
      `${API_VERSION}/${API_TAG}/:id`,
      ProductControllers.getProduct,
  );
};
