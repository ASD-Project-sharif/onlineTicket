const {isUserSuspended} = require("../repository/suspendedUser.repository");
const {hasUserReachedToMaximumOpenTicket, createNewTicket, getAllTicketsOfOrganizationWithFilterAndSorting,
    getAllTicketsOfUserWithFilterAndSorting} = require("../repository/ticket.repository");
const {getOrganizationAdminId, getOrganizationIdByAgentId} = require("../repository/organization.repository");
const {isNormalUser} = require("../repository/user.repository");
const TicketType = require("../models/enums/ticketType.enum");


const isInputDataValid = (req, res) => {
    if (!Object.values(TicketType).includes(req.body.type)) {
        res.status(400).send({message: "ticket type is invalid!"});
        return false;
    }

    if (req.body.title.length > 100) {
        res.status(400).send({message: "Title length should be less than or equal to 100 characters."});
        return false;
    }

    if (req.body.description.length > 1000) {
        res.status(400).send({message: "Description length should be less than or equal to 1000 characters."});
        return false;
    }

    if (req.body.deadline) {
        const deadline = new Date(req.body.deadline);
        if (isNaN(deadline.getTime())) {
            res.status(400).send({message: "Invalid deadline format"});
            return false;
        }
        if (deadline <= new Date()) {
            res.status(400).send({message: "Deadline must be after now!!"});
            return false;
        }
    }
    return true;
}

const canUserCreateNewTicket = async (req, res) => {
    const adminId = await getOrganizationAdminId(req.body.organizationId);
    if (adminId === null) {
        res.status(403).send({message: "Organization is not correct"});
        return false;
    }

    const isUserNormal = await isNormalUser(req.userId);
    if (!isUserNormal) {
        res.status(403).send({message: "Only normal users can create ticket"});
        return false;
    }

    const isUserSuspendedInThisOrganization = await isUserSuspended(req.userId, req.body.organizationId);
    if (isUserSuspendedInThisOrganization) {
        res.status(403).send({message: "You are Suspended!"});
        return false;
    }

    if (await hasUserReachedToMaximumOpenTicket(req.userId)) {
        res.status(403).send({message: "You can not have more than 30 open tickets!"});
        return false;
    }

    return true;
}


createTicket = async (req, res) => {
    if (!isInputDataValid(req, res)) {
        return;
    }
    const canUserCreateTicket = await canUserCreateNewTicket(req, res);
    if (!canUserCreateTicket) {
        return;
    }

    const ticket = {
        title: req.body.title,
        description: req.body.description,
        created_by: req.userId,
        assignee: await getOrganizationAdminId(req.body.organizationId),
        organization: req.body.organizationId,
        type: req.body.type
    };

    if (req.body.deadline) {
        ticket.deadline = new Date(req.body.deadline);
    }
    await createNewTicket(ticket);
    res.send({message: "Ticket added successfully!"});
}

const getTicketsByOrganization = async (req, res) => {
    const organizationId = await getOrganizationIdByAgentId(req.params.agentId);

    const filter = {
        type: req.body.filter.type,
        status: req.body.filter.status,
        intervalStart: req.body.filter.intervalStart,
        intervalEnd: req.body.filter.intervalEnd,
    }
    const sort = {
        type: req.body.sort.type,
        order: req.body.sort.order
    }

    const tickets = await getAllTicketsOfOrganizationWithFilterAndSorting(organizationId, filter, sort);
    req.send({
        message: "Got tickets successfully!",
        tickets,
    })
};

const getUserTickets = async (req, res) => {
    const userId = req.params.userId

    const filter = {
        type: req.body.filter.type,
        status: req.body.filter.status,
        intervalStart: req.body.filter.intervalStart,
        intervalEnd: req.body.filter.intervalEnd,
    }
    const sort = {
        type: req.body.sort.type,
        order: req.body.sort.order
    }

    const tickets = await getAllTicketsOfUserWithFilterAndSorting(userId, filter, sort);
    req.send({
        message: "Got tickets successfully!",
        tickets,
    })
};

const TicketServices = {
    createTicket,
    getTicketsByOrganization,
    getUserTickets,
}

module.exports = TicketServices;