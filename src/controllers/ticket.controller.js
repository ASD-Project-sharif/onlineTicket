const TicketServices = require("../services/ticket.services");

addTicket = async (req, res) => {
    await TicketServices.createTicket(req, res);
};

editTicket = async (req, res) => {
    await TicketServices.editTicket(req, res);
}

const TicketControllers = {
    addTicket,
    editTicket
}

module.exports = TicketControllers;