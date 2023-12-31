const TicketServices = require("../services/ticket.services");

addTicket = async (req, res) => {
    await TicketServices.createTicket(req, res);
};

editTicket = async (req, res) => {
    await TicketServices.editTicket(req, res);
}

changeStatus = async (req, res) => {
    await TicketServices.changeTicketStatus(req, res);
}

const TicketControllers = {
    addTicket,
    editTicket,
    changeStatus
}

module.exports = TicketControllers;