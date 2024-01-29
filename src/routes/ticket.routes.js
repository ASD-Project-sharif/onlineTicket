const {authJwt} = require('../middlewares');
const TicketControllers = require('../controllers/ticket.controller');

const API_VERSION = '/api/v1';
const API_TAG = 'ticket';

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
   * /api/v1/ticket/add:
   *   post:
   *     summary: Add a new ticket
   *     description: Create a new ticket with the provided details.
   *     tags:
   *       - Ticket
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Title of the ticket
   *               description:
   *                 type: string
   *                 description: Description of the ticket
   *               organizationId:
   *                 type: string
   *                 description: ID of the organization
   *               type:
   *                 type: string
   *                 description: Type of the ticket (e.g., bug, question, suggestion)
   *               deadline:
   *                  type: string
   *                  description: New deadline for the ticket
   *               product:
   *                 type: string
   *                 description: id of the product to create ticket for
   *     responses:
   *       '200':
   *         description: Ticket added successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Forbidden, user not allowed to add a ticket
   */
  app.post(
      `${API_VERSION}/${API_TAG}/add`,
      [
        authJwt.verifyToken,
      ],
      TicketControllers.addTicket,
  );

  /**
   * @swagger
   * /api/v1/ticket/edit/{id}:
   *   post:
   *     summary: Edit a ticket by ID
   *     description: Edit an existing ticket using its unique identifier.
   *     tags:
   *       - Ticket
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the ticket to be edited
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: New title for the ticket
   *               description:
   *                 type: string
   *                 description: New description for the ticket
   *     responses:
   *       '200':
   *         description: Ticket edited successfully
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
      TicketControllers.editTicket,
  );

  /**
   * @swagger
   * /api/v1/ticket/change/status/{id}:
   *   post:
   *     summary: change a ticket status
   *     description: Open or close a ticket
   *     tags:
   *       - Ticket
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the ticket to be edited
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               open:
   *                 type: boolean
   *                 description: ticket should be closed or open
   *     responses:
   *       '200':
   *         description: Ticket edited successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid, or you do nor have access to edit
   */
  app.post(
      `${API_VERSION}/${API_TAG}/change/status/:id`,
      [
        authJwt.verifyToken,
      ],
      TicketControllers.changeStatus,
  );

  /**
   * @swagger
   * /api/v1/ticket/organization:
   *   get:
   *     summary: Get organization tickets
   *     description: Get tickets associated with the organization.
   *     tags:
   *       - Ticket
   *     parameters:
   *       - in: query
   *         name: filter[type]
   *         description: Filter tickets by type
   *         schema:
   *           type: string
   *       - in: query
   *         name: filter[status]
   *         description: Filter tickets by status
   *         schema:
   *           type: string
   *       - in: query
   *         name: filter[intervalStart]
   *         description: Filter tickets by interval start
   *         schema:
   *           type: string
   *       - in: query
   *         name: filter[intervalEnd]
   *         description: Filter tickets by interval end
   *         schema:
   *           type: string
   *       - in: query
   *         name: sort[sortBy]
   *         description: Sort tickets by field
   *         schema:
   *           type: string
   *       - in: query
   *         name: sort[sortOrder]
   *         description: Sort tickets in ascending or descending order
   *         schema:
   *           type: string
   *       - in: query
   *         name: deadlineStatus
   *         description: Filter tickets by deadline status
   *         schema:
   *           type: string
   *       - in: query
   *         name: pageSize
   *         description: Number of tickets per page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *       - in: query
   *         name: pageNumber
   *         description: Page number
   *         schema:
   *           type: integer
   *           minimum: 1
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
      TicketControllers.getOrganizationTickets,
  );

  /**
   * @swagger
   * /api/v1/ticket/user:
   *   get:
   *     summary: Get user tickets
   *     description: Get tickets associated with the user.
   *     tags:
   *       - Ticket
   *     parameters:
   *       - in: query
   *         name: filter[type]
   *         description: Filter tickets by type
   *         schema:
   *           type: string
   *       - in: query
   *         name: filter[status]
   *         description: Filter tickets by status
   *         schema:
   *           type: string
   *       - in: query
   *         name: filter[intervalStart]
   *         description: Filter tickets by interval start
   *         schema:
   *           type: string
   *       - in: query
   *         name: filter[intervalEnd]
   *         description: Filter tickets by interval end
   *         schema:
   *           type: string
   *       - in: query
   *         name: sort[sortBy]
   *         description: Sort tickets by field
   *         schema:
   *           type: string
   *       - in: query
   *         name: sort[sortOrder]
   *         description: Sort tickets in ascending or descending order
   *         schema:
   *           type: string
   *       - in: query
   *         name: deadlineStatus
   *         description: Filter tickets by deadline status
   *         schema:
   *           type: string
   *       - in: query
   *         name: pageSize
   *         description: Number of tickets per page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *       - in: query
   *         name: pageNumber
   *         description: Page number
   *         schema:
   *           type: integer
   *           minimum: 1
   *     responses:
   *       '200':
   *         description: Success
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid
   */
  app.get(
      `${API_VERSION}/${API_TAG}/user`,
      [
        authJwt.verifyToken,
      ],
      TicketControllers.getUserTickets,
  );

  /**
   * @swagger
   * /api/v1/ticket/{id}:
   *   get:
   *     summary: get a ticket
   *     description: get all fields of a ticket
   *     tags:
   *       - Ticket
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the ticket
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Ticket fetched successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid, or you do nor have access to edit
   */
  app.get(
      `${API_VERSION}/${API_TAG}/:id`,
      [
        authJwt.verifyToken,
      ],
      TicketControllers.getTicket,
  );

  /**
   * @swagger
   * /api/v1/ticket/search/{title}:
   *   get:
   *     summary: search tickets
   *     description: search for tickets with matched title
   *     tags:
   *       - Ticket
   *     parameters:
   *       - in: path
   *         name: title
   *         description: title of ticket
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Ticket(s) fetched successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid, or you do nor have access to get
   */
  app.get(
      '/api/v1/ticket/search/:ticketTitle',
      [
        authJwt.verifyToken,
      ],
      TicketControllers.getTicketsByTitle,
  );

  /**
   * @swagger
   * /api/v1/ticket/assign/{id}:
   *   post:
   *     summary: Assign a ticket by ID
   *     description: Assign a ticket to an agent.
   *     tags:
   *       - Ticket
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID of the ticket to be assigned
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               assignee:
   *                 type: string
   *                 description: id of user to assign
   *     responses:
   *       '200':
   *         description: Ticket assigned successfully
   *       '400':
   *         description: Bad request, check the request payload
   *       '403':
   *         description: Unauthorized, token is missing/invalid, or you do nor have access to edit
   */
  app.post(
      `${API_VERSION}/${API_TAG}/assign/:id`,
      [
        authJwt.verifyToken,
      ],
      TicketControllers.assignTicket,
  );
};
