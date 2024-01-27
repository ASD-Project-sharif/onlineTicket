const SuspendedUserRepository = require('../repository/suspendedUser.repository');
const TicketRepository = require('../repository/ticket.repository');
const OrganizationRepository = require('../repository/organization.repository');
const UserRepository = require('../repository/user.repository');
const TicketType = require('../models/enums/ticketType.enum');
const TicketStatus = require('../models/enums/ticketStatus.enum');
const TimeServices = require('./time.services');
const DeadlineStatus = require('../models/enums/deadlineStatus.enum');


/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {boolean}
 */
const isInputDataValid = (req, res) => {
  if (req.body.type && !Object.values(TicketType).includes(req.body.type)) {
    res.status(400).send({message: 'ticket type is invalid!'});
    return false;
  }

  if (req.body.title.length > 100) {
    res.status(400).send(
        {message: 'Title length should be less than or equal to 100 characters.'});
    return false;
  }

  if (req.body.description.length > 1000) {
    res.status(400).send(
        {message: 'Description length should be less than or equal to 1000 characters.'});
    return false;
  }

  if (req.body.deadline) {
    const deadline = new Date(req.body.deadline);
    if (isNaN(deadline.getTime())) {
      res.status(400).send({message: 'Invalid deadline format'});
      return false;
    }
    if (deadline <= TimeServices.now()) {
      res.status(400).send({message: 'Deadline must be after now!!'});
      return false;
    }
  }
  return true;
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<boolean>}
 */
const canUserCreateNewTicket = async (req, res) => {
  const organizationExist = await OrganizationRepository.hasOrganizationExist(req.body.organizationId);
  if (!organizationExist) {
    res.status(403).send({message: 'Organization is not correct'});
    return false;
  }

  const isUserNormal = await UserRepository.isNormalUser(req.userId);
  if (!isUserNormal) {
    res.status(403).send({message: 'Only normal users can create ticket'});
    return false;
  }

  const isUserSuspendedInThisOrganization = await SuspendedUserRepository.isUserSuspended(
      req.userId,
      req.body.organizationId,
  );
  if (isUserSuspendedInThisOrganization) {
    res.status(403).send({message: 'You are Suspended!'});
    return false;
  }

  if (await TicketRepository.hasUserReachedToMaximumOpenTicket(req.userId)) {
    res.status(403).send({message: 'You can not have more than 30 open tickets!'});
    return false;
  }

  return true;
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<boolean>}
 */
const canUserEditTicket = async (req, res) => {
  const ticketId = req.params.id;
  const ticketExist = await TicketRepository.hasTicketExist(ticketId);
  if (!ticketExist) {
    res.status(403).send({message: 'Ticket does not exist!'});
    return false;
  }
  const isTicketOpen = await TicketRepository.isTicketOpen(ticketId);
  if (!isTicketOpen) {
    res.status(403).send({message: 'you can not edit closed ticket!'});
    return false;
  }
  const ticketReporterId = await TicketRepository.getTicketReporterId(ticketId);
  if (ticketReporterId !== req.userId) {
    res.status(403).send({message: 'this ticket does not belong to you!'});
    return false;
  }

  return true;
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
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
    assignee: await OrganizationRepository.getOrganizationAdminId(req.body.organizationId),
    organization: req.body.organizationId,
    type: req.body.type,
  };

  if (req.body.deadline) {
    ticket.deadline = new Date(req.body.deadline);
  }
  const ticketCreated = await TicketRepository.createNewTicket(ticket);
  res.send({message: 'Ticket added successfully!', id: ticketCreated._id});
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
editTicket = async (req, res) => {
  if (!isInputDataValid(req, res)) {
    return;
  }
  const canEdit = await canUserEditTicket(req, res);
  if (!canEdit) {
    return;
  }

  const ticket = {
    title: req.body.title,
    description: req.body.description,
    updated_at: TimeServices.now(),
  };

  await TicketRepository.editTicket(req.params.id, ticket);
  res.send({message: 'ticket edited successfully'});
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<boolean>}
 */
async function canUserOpenOrCloseTicket(req, res) {
  const ticketId = req.params.id;

  const ticketExist = await TicketRepository.hasTicketExist(ticketId);
  if (!ticketExist) {
    res.status(403).send({message: 'Ticket does not exist!'});
    return false;
  }

  const canUserChangeTicketStatus = await UserRepository.isOrganizationUser(req.userId);
  if (!canUserChangeTicketStatus) {
    res.status(403).send({message: 'You can not open/close a Ticket'});
    return false;
  }

  return true;
}

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
changeTicketStatus = async (req, res) => {
  const canChange = await canUserOpenOrCloseTicket(req, res);
  if (!canChange) {
    return;
  }
  const shouldOpen = Boolean(req.body.open);
  const ticket = {
    status: shouldOpen ? TicketStatus.IN_PROGRESS : TicketStatus.CLOSED,
    updated_at: TimeServices.now(),
  };

  await TicketRepository.editTicket(req.params.id, ticket);
  res.status(200).send({message: 'Ticket ' + (shouldOpen ? 'Opened' : 'Closed')});
};

const getTicketsByOrganization = async (req, res) => {
  const userId = req.userId;
  const organizationId = await OrganizationRepository.getOrganizationIdByAgentId(userId);
  const tickets = await getTicketsWithFilterAndSorting(req, res, userId, organizationId);
  const slicedTickets = await sliceListByPagination(req, res, tickets);
  res.status(200).send({
    tickets: slicedTickets,
    count: tickets.length,
  });
};
const getTicketsByUser = async (req, res) => {
  const userId = req.userId;
  const tickets = await getTicketsWithFilterAndSorting(req, res, userId);
  const slicedTickets = await sliceListByPagination(req, res, tickets);
  res.status(200).send({
    tickets: slicedTickets,
    count: tickets.length,
  });
};

const getTicket = async (req, res) => {
  const ticket = await TicketRepository.getTicketById(req.params.ticketId);
  res.status(200).send({
    ticket,
    message: 'Ticket returened successfully!',
  });
};

const getTicketsWithFilterAndSorting = async (req, res, userId, organizationId) => {
  const filter = {
    type: req.query.filter?.type,
    status: req.query.filter?.status,
    intervalStart: req.query.filter?.intervalStart,
    intervalEnd: req.query.filter?.intervalEnd,
  };
  const sort = {
    type: req.query.sort?.sortBy,
    order: req.query.sort?.sortOrder,
  };

  const deadlineStatus = req.query.deadlineStatus;

  let tickets = await
  TicketRepository.getAllTicketsOfUserWithFilterAndSorting(userId, filter, sort, deadlineStatus, organizationId);

  if (organizationId) {
    tickets = await sortTicketsByAssigneeAndStatus(tickets, userId);
  }

  const ticketsWithUpdatedStatus = setTicketsDeadlineStatus(tickets);

  return ticketsWithUpdatedStatus;
};

const sliceListByPagination = async (req, res, list) => {
  const page = {
    size: req.query.pageSize,
    number: req.query.pageNumber,
  };
  const startIndex = (page.number - 1) * page.size;
  const pagedList = list.slice(startIndex, startIndex + page.size);
  return pagedList;
};

const calculateDeadlineStatus = (deadline) => {
  if (deadline && deadline <= TimeServices.now()) {
    return DeadlineStatus.PASSED;
  } else if (deadline && deadline <= TimeServices.oneDayBeforeAfter()) {
    return DeadlineStatus.NEAR;
  } else {
    return DeadlineStatus.NORMAL;
  }
};

const setTicketsDeadlineStatus = (tickets) => {
  return tickets.map((ticket) => ({
    ...ticket,
    deadlineStatus: calculateDeadlineStatus(ticket.deadline),
  }));
};

const sortTicketsByAssigneeAndStatus = (tickets, userId) => {
  const openAssignedTickets = [];
  const openUnAssignedTickets = [];
  const closedAssignedTickets = [];
  const closedUnAssignedTickets = [];

  for (const ticket of tickets) {
    if (ticket.status !== TicketStatus.CLOSED) {
      if (ticket.assignee._id.toString() === userId) {
        openAssignedTickets.push(ticket);
      } else {
        openUnAssignedTickets.push(ticket);
      }
    } else {
      if (ticket.assignee._id.toString() === userId) {
        closedAssignedTickets.push(ticket);
      } else {
        closedUnAssignedTickets.push(ticket);
      }
    }
  }
  return openAssignedTickets.concat(openUnAssignedTickets, closedAssignedTickets, closedUnAssignedTickets);
};

const getTicketsByTitle = async (req, res) => {
  const tickets = await TicketRepository.getTicketsByTitle(req.params.ticketTitle);
  res.status(200).send({
    tickets,
    message: 'Ticket returened successfully!',
  });
};

const TicketServices = {
  createTicket,
  editTicket,
  changeTicketStatus,
  getTicketsByOrganization,
  getTicketsByUser,
  getTicket,
  getTicketsByTitle,
};

module.exports = TicketServices;
