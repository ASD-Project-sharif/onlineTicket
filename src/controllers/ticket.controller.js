const TicketServices = require("../services/ticket.services");

addTicket = async (req, res) => {
    await TicketServices.createTicket(req, res);
};

// const getUserTickets = async (userId) => {
//     return await TicketServices.getTicketsByUser(userId);
// };

const getOrganiztionTickets = async (req, res) => {
    return await TicketServices.getTicketsByOrganization(req, res);
};

const TicketControllers = {
    addTicket,
    getOrganiztionTickets,
    // getUserTickets,

}

module.exports = TicketControllers;