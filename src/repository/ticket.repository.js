const {
    findOneDocument,
    createDocument,
    mongooseClient,
    getDocumentById,
    countDocuments,
    countDocumentsByQuery,
    getAllDocuments,
    getAllDocumentsWithFilterAndSort
    countDocumentsByQuery,
    updateDocumentById
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

    const result = await getAllDocumentsWithFilterAndSort("Ticket", query, options)
        .populate('organization', 'name')
        .populate('assignee', 'username')
        .populate('created_by', 'username')
        .sort(options)
        .lean();

    return result;
};

const getTicketById = async (ticketId) => {
    const ticket = await getDocumentById("Ticket", ticketId)
        .populate('organization', 'name')
        .populate('assignee', 'username')
        .populate('created_by', 'username')
        .lean();
    return ticket;
}


editTicket = async (id, data) => {
    return await updateDocumentById("Ticket", id, data);
}


const TicketRepository = {
    hasUserReachedToMaximumOpenTicket,
    createNewTicket,
    getAllTicketsOfUserWithFilterAndSorting,
    getTicketById
    createNewTicket,
    editTicket,
    isTicketOpen,
    getTicketReporterId,
    hasTicketExist,
    getTicketOrganizationId
}

module.exports = TicketRepository;

