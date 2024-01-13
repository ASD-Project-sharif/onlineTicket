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
   *               deadline:
   *                  type: string
   *                  description: New deadline for the ticket
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
  //
  // app.get(
  //     '/api/v1/ticket/get/:id',
  //     [
  //         authJwt.verifyToken
  //     ],
  //     TicketControllers.getTicket
  // );
  //
  // app.get(
  //     '/api/v1/ticket/get/',
  //     [
  //         authJwt.verifyToken,
  //         authJwt.isFinalUser
  //     ],
  //     TicketControllers.getOrganiztionTickets
  // );
  //
  // app.get(
  //     '/api/v1/ticket/user/get',
  //     [
  //         authJwt.verifyToken,
  //         authJwt.isFinalUser
  //     ],
  //     TicketControllers.getUserTickets
  // );
};
