const {authJwt} = require("../middlewares");
const TicketControllers = require("../controllers/ticket.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/v1/ticket/add",
        [
            authJwt.verifyToken,
            // authJwt.isFinalUser
        ],
        TicketControllers.addTicket
    );

    app.post(
        "/api/v1/ticket/edit/",
        [
            authJwt.verifyToken,
            authJwt.isFinalUser
        ],
        TicketControllers.editTicket
    );

    app.get(
        "/api/v1/ticket/get/:id",
        [
            authJwt.verifyToken
        ],
        TicketControllers.getTicket
    );

    app.get(
        "/api/v1/ticket/get/",
        [
            authJwt.verifyToken,
            authJwt.isFinalUser
        ],
        TicketControllers.getOrganiztionTickets
    );

    app.get(
        "/api/v1/ticket/user/get",
        [
            authJwt.verifyToken,
            authJwt.isFinalUser
        ],
        TicketControllers.getUserTickets
    );
};