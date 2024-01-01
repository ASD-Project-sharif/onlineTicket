const {
    findOneDocument,
    createDocument,
    mongooseClient,
    getDocumentById,
    countDocuments,
    countDocumentsByQuery,
    updateDocumentById
} = require("../dataAccess/dataAccess");

const TicketStatus = require("../models/enums/ticketStatus.enum")


hasUserReachedToMaximumOpenTicket = async (userId) => {
    const ticketCount = await countDocumentsByQuery("Ticket", {
        created_by: userId,
        status: {$ne: TicketStatus.CLOSED}
    });
    return ticketCount >= 30;
}

isTicketOpen = async (ticketId) => {
    const ticket = await getDocumentById("Ticket", ticketId);
    return ticket.status !== TicketStatus.CLOSED;
}

hasTicketExist = async (ticketId) => {
    const ticket = await getDocumentById("Ticket", ticketId);
    return ticket !== null;
}

getTicketReporterId = async (ticketId) => {
    const ticket = await getDocumentById("Ticket", ticketId);
    return ticket.created_by._id.toString();
}

getTicketOrganizationId = async (ticketId) => {
    const ticket = await getDocumentById("Ticket", ticketId);
    return ticket.organization._id.toString();
}

createNewTicket = async (data) => {
    return await createDocument("Ticket", data);
}


editTicket = async (id, data) => {
    return await updateDocumentById("Ticket", id, data);
}


const TicketRepository = {
    hasUserReachedToMaximumOpenTicket,
    createNewTicket,
    editTicket,
    isTicketOpen,
    getTicketReporterId,
    hasTicketExist,
    getTicketOrganizationId
}

module.exports = TicketRepository;

