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
const DeadlineStatus = require("../models/enums/deadlineStatus.enum");


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

const getAllTicketsOfUserWithFilterAndSorting = async (id, userType, filter, sort, deadlineStatus) => {
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

    if (deadlineStatus == DeadlineStatus.PASSED) {
        query.deadline = {
            $lte: new Date(),
        }
    }
    if (deadlineStatus == DeadlineStatus.NEAR) {
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const oneDayBeforeAfter = new Date(Date.now() + oneDayInMillis);

        query.deadline = {
            $gte: new Date(),
            $lte: oneDayBeforeAfter,
        }
    }

    const options = {};

    if (sort.type) {
        options[sort.type] = sort.order === 'ASC' ? 1 : -1;
    }

    const result = await getAllDocumentsWithFilterAndSort("Ticket", query, options);

    return result;
};

const getTicketById = async (ticketId) => {
    const ticket = await getDocumentById("Ticket", ticketId);
    return ticket;
}



const TicketRepository = {
    hasUserReachedToMaximumOpenTicket,
    createNewTicket,
    getAllTicketsOfUserWithFilterAndSorting,
    getTicketById
}

module.exports = TicketRepository;

