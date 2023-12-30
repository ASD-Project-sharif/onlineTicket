const TicketServices = require("../services/ticket.services");

addTicket = async (req, res) => {
    await TicketServices.createTicket(req, res);
};


const TicketControllers = {
    addTicket
}

module.exports = TicketControllers;