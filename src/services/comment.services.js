const SuspendedUserRepository = require('../repository/suspendedUser.repository');
const TicketRepository = require('../repository/ticket.repository');
const CommentRepository = require('../repository/comment.repository');
const UserRepository = require('../repository/user.repository');
const TimeServices = require('./time.services');

const TicketStatus = require('../models/enums/ticketStatus.enum');

const isInputDataValid = (req, res) => {
  if (req.body.text.length > 1000) {
    res.status(400).send(
        {message: 'Text length should be less than or equal to 1000 characters.'});
    return false;
  }
  return true;
};

const isTicketExistAndOpen = async (req, res, ticketId) => {
  const ticketExist = await TicketRepository.hasTicketExist(ticketId);
  if (!ticketExist) {
    res.status(403).send({message: 'Ticket does not exist'});
    return false;
  }

  const isTicketOpen = await TicketRepository.isTicketOpen(ticketId);
  if (!isTicketOpen) {
    res.status(403).send({message: 'you can not comment on closed ticket!'});
    return false;
  }
  return true;
};

const canUserEditComment = async (req, res) => {
  const commentId = req.params.id;
  const commentExist = await CommentRepository.hasCommentExist(commentId);
  if (!commentExist) {
    res.status(403).send({message: 'Comment does not exist'});
    return false;
  }

  const ticketId = await CommentRepository.getCommentTicketId(commentId);
  const isTicketOpen = await isTicketExistAndOpen(req, res, ticketId);
  if (!isTicketOpen) {
    res.status(403).send({message: 'you can not edit a comment on closed ticket!'});
    return false;
  }

  const organizationId = await TicketRepository.getTicketOrganizationId(ticketId);
  const isUserSuspendedInThisOrganization = await SuspendedUserRepository.isUserSuspended(
      req.userId, organizationId);
  if (isUserSuspendedInThisOrganization) {
    res.status(403).send({message: 'You are Suspended!'});
    return false;
  }

  const commentReporterId = await CommentRepository.getCommentReporterId(commentId);
  if (commentReporterId !== req.userId) {
    res.status(403).send({message: 'you can not edit others comment!'});
    return false;
  }
  return true;
};

const canUserCreateComment = async (req, res) => {
  const ticketId = req.params.id;

  const isTicketOpen = await isTicketExistAndOpen(req, res, ticketId);
  if (!isTicketOpen) {
    res.status(403).send({message: 'you can not comment on closed ticket!'});
    return false;
  }

  const organizationId = await TicketRepository.getTicketOrganizationId(ticketId);
  const isUserSuspendedInThisOrganization =
      await SuspendedUserRepository.isUserSuspended(req.userId, organizationId);
  if (isUserSuspendedInThisOrganization) {
    res.status(403).send({message: 'You are Suspended!'});
    return false;
  }

  const isUserNormal = await UserRepository.isNormalUser(req.userId);
  const ticketReportedId = await TicketRepository.getTicketReporterId(ticketId);
  if (isUserNormal && ticketReportedId !== req.userId) {
    res.status(403).send({message: 'You can not comment on other users ticket'});
    return false;
  }

  return true;
};

createComment = async (req, res) => {
  if (!isInputDataValid(req, res)) {
    return;
  }
  const canCreateComment = await canUserCreateComment(req, res);
  if (!canCreateComment) {
    return;
  }

  const comment = {
    text: req.body.text,
    created_by: req.userId,
    ticket: req.params.id,
  };

  const commentCreated = await CommentRepository.createNewComment(comment);

  const isNormalUser = await UserRepository.isNormalUser(req.userId);
  const ticket = {
    updated_at: TimeServices.now(),
    status: isNormalUser ? TicketStatus.WAITING_FOR_ADMIN : TicketStatus.IN_PROGRESS,
  };
  await TicketRepository.editTicket(req.params.id, ticket);
  res.send(
      {
        message: 'Comment added successfully',
        id: commentCreated._id,
      },
  );
};

editComment = async (req, res) => {
  if (!isInputDataValid(req, res)) {
    return;
  }
  const canEdit = await canUserEditComment(req, res);
  if (!canEdit) {
    return;
  }

  const comment = {
    text: req.body.text,
    updated_at: TimeServices.now(),
  };
  const commentUpdated = await CommentRepository.editComment(req.params.id, comment);
  res.send(
      {
        message: 'Comment edited successfully',
        id: commentUpdated._id,
      },
  );
};

const TicketServices = {
  createComment,
  editComment,
};

module.exports = TicketServices;
