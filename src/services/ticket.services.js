const SuspendedUserRepository = require('../repository/suspendedUser.repository');
const TicketRepository = require('../repository/ticket.repository');
const CommentRepository = require('../repository/comment.repository');
const ProductRepository = require('../repository/product.repository');
const OrganizationRepository = require('../repository/organization.repository');
const UserRepository = require('../repository/user.repository');
const TicketType = require('../models/enums/ticketType.enum');
const TicketStatus = require('../models/enums/ticketStatus.enum');
const TimeServices = require('./time.services');
const DeadlineStatus = require('../models/enums/deadlineStatus.enum');
const PaginationServices = require('../services/pagination.services');

const TicketLogRepository = require('../repository/ticketLog.repository');

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
    deadline.setMinutes(deadline.getMinutes() + 210);
    deadline.setUTCHours(23, 59, 59, 999);
    if (isNaN(deadline.getTime())) {
      res.status(400).send({message: 'Invalid deadline format'});
      return false;
    }
    if (deadline <= TimeServices.now()) {
      res.status(400).send({message: 'Deadline must be after now!!'});
      return false;
    }
    req.body.deadline = deadline;
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

  if (req.body.product) {
    const productExist = await ProductRepository.hasProductExist(req.body.product);
    if (!productExist) {
      res.status(400).send({message: 'Product does not exist!'});
      return false;
    }
    const productOrganizationId = await ProductRepository.getProductOrganizationId(req.body.product);
    if (productOrganizationId !== req.body.organizationId) {
      res.status(400).send({message: 'Product is not for this organization!'});
      return false;
    }
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

const canUserFetchTicket = async (req, res) => {
  const ticketExist = await TicketRepository.hasTicketExist(req.params.id);
  if (!ticketExist) {
    res.status(400).send({message: 'ticket does not exist!'});
    return false;
  }

  const isNormalUser = await UserRepository.isNormalUser(req.userId);
  if (isNormalUser) {
    const ticketReporterId = await TicketRepository.getTicketReporterId(req.params.id);
    if (ticketReporterId !== req.userId) {
      res.status(403).send({message: 'this is not your ticket!'});
      return false;
    }
    return true;
  }
  const userOrganizationId = await OrganizationRepository.getOrganizationIdByAgentId(req.userId);
  const ticketOrganizationId = await TicketRepository.getTicketOrganizationId(req.params.id);
  if (userOrganizationId !== ticketOrganizationId) {
    res.status(403).send({message: 'this is not your organization ticket!'});
    return false;
  }
  return true;
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

  return setTicketsDeadlineStatus(tickets);
};

const sliceListByPagination = async (req, res, list) => {
  const page = {
    size: req.query.pageSize,
    number: req.query.pageNumber,
  };
  return await PaginationServices.sliceListByPagination(parseInt(page.size), parseInt(page.number), list);
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

const canTicketBeAssignedToAssignee = async (req, res) => {
  if (!req.body.assignee) {
    res.status(400).send({message: 'assignee is empty!'});
    return false;
  }
  const ticketExist = await TicketRepository.hasTicketExist(req.params.id);
  if (!ticketExist) {
    res.status(400).send({message: 'ticket does not exist!'});
    return false;
  }

  const assigneeOrganizationId = await OrganizationRepository.getOrganizationIdByAgentId(req.body.assignee);
  const ticketOrganizationId = await TicketRepository.getTicketOrganizationId(req.params.id);

  if (assigneeOrganizationId !== ticketOrganizationId) {
    res.status(400).send({message: 'assignee should be in your organization!'});
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

  if (req.body.product) {
    ticket.product = req.body.product;
  }

  const ticketCreated = await TicketRepository.createNewTicket(ticket);
  await TicketLogRepository.logTicket(req.userId, ticketCreated._id, ticket, 'Add Ticket');

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
  await TicketLogRepository.logTicket(req.userId, req.params.id, ticket, 'Edit Ticket');

  res.send({message: 'ticket edited successfully'});
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
assignTicket = async (req, res) => {
  const canTicketBeAssigned = await canTicketBeAssignedToAssignee(req, res);
  if (!canTicketBeAssigned) {
    return;
  }

  const ticket = {
    assignee: req.body.assignee,
    updated_at: TimeServices.now(),
  };
  await TicketRepository.editTicket(req.params.id, ticket);
  await TicketLogRepository.logTicket(req.userId, req.params.id, ticket, 'Assign Ticket');

  res.send({message: 'ticket assigned successfully!'});
};

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
  await TicketLogRepository.logTicket(req.userId, req.params.id, ticket, (shouldOpen ? 'Open' : 'Close') + '  Ticket');

  res.status(200).send({message: 'Ticket ' + (shouldOpen ? 'Opened' : 'Closed')});
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
getTicketsByOrganization = async (req, res) => {
  const userId = req.userId;
  const organizationId = await OrganizationRepository.getOrganizationIdByAgentId(userId);
  const tickets = await getTicketsWithFilterAndSorting(req, res, userId, organizationId);
  const slicedTickets = await sliceListByPagination(req, res, tickets);
  res.status(200).send({
    tickets: slicedTickets,
    count: tickets.length,
  });
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
getTicketsByUser = async (req, res) => {
  const userId = req.userId;
  const tickets = await getTicketsWithFilterAndSorting(req, res, userId);
  const slicedTickets = await sliceListByPagination(req, res, tickets);
  res.status(200).send({
    tickets: slicedTickets,
    count: tickets.length,
  });
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
const getTicket = async (req, res) => {
  const canSeeTicket = await canUserFetchTicket(req, res);
  if (!canSeeTicket) {
    return;
  }

  const ticket = await TicketRepository.getTicketById(req.params.id);
  const comments = await CommentRepository.getTicketComments(req.params.id);
  const isUserSuspended = await SuspendedUserRepository.isUserSuspended(ticket.created_by._id, ticket.organization._id);
  res.status(200).send({
    ticket: ticket,
    comments: comments,
    ban: isUserSuspended,
  });
};

/**
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @return {Promise<void>}
 */
const getTicketsByTitle = async (req, res) => {
  const organizationId = await OrganizationRepository.getOrganizationIdByAgentId(req.userId);
  const tickets = await TicketRepository.getTicketsByTitle(req.params.title, organizationId);
  res.status(200).send({
    tickets,
    message: 'Ticket returened successfully!',
  });
};

const TicketServices = {
  createTicket,
  editTicket,
  assignTicket,
  changeTicketStatus,
  getTicketsByOrganization,
  getTicketsByUser,
  getTicket,
  getTicketsByTitle,
};

module.exports = TicketServices;
