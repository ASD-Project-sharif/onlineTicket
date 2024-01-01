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

const getAllTicketsOfUserWithFilterAndSorting = async (userId, filter, sort) => {
    const query = {
        created_by: userId,
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
    getAllTicketsOfUserWithFilterAndSorting,

}

module.exports = TicketRepository;

