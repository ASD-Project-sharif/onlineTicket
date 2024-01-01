const {authJwt} = require("../middlewares");
const CommentControllers = require("../controllers/comment.controller");

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
     * /api/v1/comment/add/{id}:
     *   post:
     *     summary: Add a new comment
     *     description: Create a new comment on existing ticket.
     *     tags:
     *       - Comment
     *     parameters:
     *       - in: path
     *         name: id
     *         description: ID of the ticket to add comment
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               text:
     *                 type: string
     *                 description: what is your comment?
     *     responses:
     *       '200':
     *         description: Ticket added successfully
     *       '400':
     *         description: Bad request, check the request payload
     *       '403':
     *         description: Forbidden, user not allowed to add a ticket
     */
    app.post(
        "/api/v1/comment/add/:id",
        [
            authJwt.verifyToken
        ],
        CommentControllers.addComment
    );

    /**
     * @swagger
     * /api/v1/comment/edit/{id}:
     *   post:
     *     summary: Add a new comment
     *     description: Create a new comment on existing ticket.
     *     tags:
     *       - Comment
     *     parameters:
     *       - in: path
     *         name: id
     *         description: ID of the comment to edit
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               text:
     *                 type: string
     *                 description: what is your comment?
     *     responses:
     *       '200':
     *         description: Ticket added successfully
     *       '400':
     *         description: Bad request, check the request payload
     *       '403':
     *         description: Forbidden, user not allowed to add a ticket
     */
    app.post(
        "/api/v1/comment/edit/:id",
        [
            authJwt.verifyToken
        ],
        CommentControllers.editComment
    );
};