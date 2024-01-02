const {
    findOneDocument,
    createDocument,
    mongooseClient,
    getDocumentById,
    countDocuments,
    countDocumentsByQuery,
    getAllDocuments,
    getAllDocumentsWithFilterAndSort
} = require("../dataAccess/dataAccess");

const TicketStatus = require("../models/enums/ticketStatus.enum");
const UserType = require("../models/enums/userRoles.enum");


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

const getAllTicketsOfUserWithFilterAndSorting = async (id, userType, filter, sort) => {
    const query = {}

    if (userType == UserType.AGENT) {
            query.organization = id;
    } else {
            query.created_by = id;
    }

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
        options[sort.type] = sort.order === 'ASC' ? 1 : -1;
    }

    const result = await getAllDocumentsWithFilterAndSort("Ticket", query, options);

    return result;
};



const TicketRepository = {
    hasUserReachedToMaximumOpenTicket,
    createNewTicket,
    getAllTicketsOfUserWithFilterAndSorting,
}

module.exports = TicketRepository;

