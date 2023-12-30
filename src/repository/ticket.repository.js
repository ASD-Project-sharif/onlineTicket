const {
    findOneDocument,
    createDocument,
    mongooseClient,
    getDocumentById,
    countDocuments,
    countDocumentsByQuery
} = require("../dataAccess/dataAccess");

const TicketStatus = require("../models/enums/ticketStatus.enum")


hasUserReachedToMaximumOpenTicket = async (userId) => {
    const ticketCount = await countDocumentsByQuery("Ticket", {
        created_by: userId,
        status: {$ne: TicketStatus.CLOSED}
    });
    return ticketCount >= 30;
}

createNewTicket = async (data) => {
    return await createDocument("Ticket", data);
}


const TicketRepository = {
    hasUserReachedToMaximumOpenTicket,
    createNewTicket
}

module.exports = TicketRepository;

