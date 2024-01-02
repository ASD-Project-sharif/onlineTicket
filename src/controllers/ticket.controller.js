const TicketServices = require("../services/ticket.services");

addTicket = async (req, res) => {
    await TicketServices.createTicket(req, res);
};

const getUserTickets = async (req, res) => {
    return await TicketServices.getTicketsByUser(req, res);
};

const getOrganiztionTickets = async (req, res) => {
    return await TicketServices.getTicketsByOrganization(req, res);
};

const getTicket = async (req, res) => {
    return await TicketServices.getTicket(req, res);
}

const TicketControllers = {
    addTicket,
    getOrganiztionTickets,
    getUserTickets,
    getTicket,

}

module.exports = TicketControllers;