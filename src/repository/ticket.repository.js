const {
    findOneDocument,
    createDocument,
    mongooseClient,
    getDocumentById,
    countDocuments,
    countDocumentsByQuery,
    getAllDocuments
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

// const getTicketsByUser = async (userId) => {
//     return await getAllDocuments("Ticket", { created_by: userId });
// };

const getAllTicketsOfOrganizationWithFilterAndSorting = async (organizationId, filter, sort) => {
    const query = {
        organization: organizationId,
    };

    if (filter.type) {
        query.type = filter.type;
    }

    if (filter.status) {
        query.status = filter.status;
    }

    if (filter.intervalStart && filter.intervalEnd) {
        query.created_at = {
            $gte: new Date(filter.intervalStart),
            $lte: new Date(filter.intervalEnd),
        };
    }

    const options = {};

    if (sort.type) {
        options[sort.type] = sort.order === 'asc' ? 1 : -1;
    }

    return await getAllDocuments("Ticket", query).sort(options);
};



const TicketRepository = {
    hasUserReachedToMaximumOpenTicket,
    createNewTicket,
    getAllTicketsOfOrganizationWithFilterAndSorting,
    // getTicketsByUser,

}

module.exports = TicketRepository;

