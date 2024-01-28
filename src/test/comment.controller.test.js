const UserRepository = require('../repository/user.repository');
const TicketRepository = require('../repository/ticket.repository');
const CommentRepository = require('../repository/comment.repository');
const SuspendedUserRepository = require('../repository/suspendedUser.repository');

const TimeServices = require('../services/time.services');
const CommentControllers = require('../controllers/comment.controller');

const TicketStatus = require('../models/enums/ticketStatus.enum');
const TicketLogRepository = require('../repository/ticketLog.repository');

jest.mock('../repository/user.repository');
jest.mock('../repository/organization.repository');
jest.mock('../repository/ticket.repository');
jest.mock('../repository/comment.repository');
jest.mock('../repository/suspendedUser.repository');
jest.mock('../repository/ticketLog.repository');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(TicketLogRepository, 'logTicket').mockImplementation((pass, salt, cb) => {});
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Comment Controllers', () => {
  validUserShouldAddCommentOnValidTicketSuccessfully();
  commentLengthMustBeLessThan1000();
  userCanNotAddCommentOnClosedTicket();
  userCanNotAddCommentIfSuspended();
  normalUserCanNotAddCommentOnOtherUserTicket();

  validUserShouldEditCommentSuccessfully();
  userCanNotEditCommentWhenTicketIsClosed();
  userCanNotEditCommentIfSuspended();
  userCanNotEditOthersComment();
});

/**
 * @private
 */
function validUserShouldAddCommentOnValidTicketSuccessfully() {
  test('add comment', async () => {
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'getTicketOrganizationId').mockImplementation((pass, salt, cb) => 'orgId');
    jest.spyOn(TicketRepository, 'getTicketReporterId').mockImplementation((pass, salt, cb) => 'userId');
    jest.spyOn(SuspendedUserRepository, 'isUserSuspended').mockImplementation((pass, salt, cb) => false);
    jest.spyOn(UserRepository, 'isNormalUser').mockImplementation((pass, salt, cb) => true);

    const now = TimeServices.now();
    jest.spyOn(TimeServices, 'now').mockImplementation((pass, salt, cb) => now);

    CommentRepository.createNewComment.mockResolvedValueOnce({_id: 'commentId'});

    const res = mockResponse();
    const commentMockData = {
      text: 'test comment',
    };

    await CommentControllers.addComment({body: commentMockData, userId: 'userId', params: {id: 'ticketId'}}, res);
    expect(CommentRepository.createNewComment).toHaveBeenCalledWith({
      ...commentMockData,
      created_by: 'userId',
      ticket: 'ticketId',
    });
    expect(TicketRepository.editTicket).toHaveBeenCalledWith('ticketId', {
      updated_at: now,
      status: TicketStatus.WAITING_FOR_ADMIN,
    });
    expect(res.send).toHaveBeenCalledWith({message: 'Comment added successfully', id: 'commentId'});
  });
}

/**
 * @private
 */
function commentLengthMustBeLessThan1000() {
  test('comment length', async () => {
    const res = mockResponse();
    const commentMockData = {
      text: new Array(1001).fill('a').join(''), // Creating a comment with length more than 1000 characters
    };

    await CommentControllers.addComment({body: commentMockData, userId: 'userId', params: {id: 'ticketId'}}, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({message: 'Text length should be less than or equal to 1000 characters.'});
  });
}

/**
 * @private
 */
function userCanNotAddCommentOnClosedTicket() {
  test('closed ticket', async () => {
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => false);

    const res = mockResponse();
    const commentMockData = {
      text: 'test comment',
    };

    await CommentControllers.addComment({body: commentMockData, userId: 'userId', params: {id: 'ticketId'}}, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({message: 'you can not comment on closed ticket!'});
  });
}

/**
 * @private
 */
function userCanNotAddCommentIfSuspended() {
  test('suspended user', async () => {
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(SuspendedUserRepository, 'isUserSuspended').mockImplementation((pass, salt, cb) => true);

    const res = mockResponse();
    const commentMockData = {
      text: 'test comment',
    };

    await CommentControllers.addComment({body: commentMockData, userId: 'userId', params: {id: 'ticketId'}}, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({message: 'You are Suspended!'});
  });
}

/**
 * @private
 */
function normalUserCanNotAddCommentOnOtherUserTicket() {
  test('others ticket', async () => {
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(UserRepository, 'isNormalUser').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(SuspendedUserRepository, 'isUserSuspended').mockImplementation((pass, salt, cb) => false);
    jest.spyOn(TicketRepository, 'getTicketReporterId').mockImplementation((pass, salt, cb) => 'otherUserId');

    const res = mockResponse();
    const commentMockData = {
      text: 'test comment',
    };

    await CommentControllers.addComment({body: commentMockData, userId: 'userId', params: {id: 'ticketId'}}, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({message: 'You can not comment on other users ticket'});
  });
}

/**
 * @private
 */
function validUserShouldEditCommentSuccessfully() {
  test('edit comment', async () => {
    jest.spyOn(CommentRepository, 'hasCommentExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(SuspendedUserRepository, 'isUserSuspended').mockImplementation((pass, salt, cb) => false);
    jest.spyOn(CommentRepository, 'getCommentReporterId').mockImplementation((pass, salt, cb) => 'userId');

    const now = TimeServices.now();
    jest.spyOn(TimeServices, 'now').mockImplementation((pass, salt, cb) => now);

    CommentRepository.editComment.mockResolvedValueOnce({_id: 'commentId'});

    const res = mockResponse();
    const commentMockData = {
      text: 'edited comment',
    };

    await CommentControllers.editComment({body: commentMockData, userId: 'userId', params: {id: 'commentId'}}, res);
    expect(CommentRepository.editComment).toHaveBeenCalledWith('commentId', {
      ...commentMockData,
      updated_at: now,
    });
    expect(res.send).toHaveBeenCalledWith({message: 'Comment edited successfully', id: 'commentId'});
  });
}

/**
 * @private
 */
function userCanNotEditCommentWhenTicketIsClosed() {
  test('edit comment - closed ticket', async () => {
    jest.spyOn(CommentRepository, 'hasCommentExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(CommentRepository, 'getCommentTicketId').mockImplementation((pass, salt, cb) => 'ticketId');
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => false);

    const res = mockResponse();
    const commentMockData = {
      text: 'edited comment',
    };

    await CommentControllers.editComment({body: commentMockData, userId: 'userId', params: {id: 'commentId'}}, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({message: 'you can not comment on closed ticket!'});
  });
}

/**
 * @private
 */
function userCanNotEditCommentIfSuspended() {
  test('edit comment - suspended user', async () => {
    jest.spyOn(CommentRepository, 'hasCommentExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(CommentRepository, 'getCommentTicketId').mockImplementation((pass, salt, cb) => 'ticketId');
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(SuspendedUserRepository, 'isUserSuspended').mockImplementation((pass, salt, cb) => true);

    const res = mockResponse();
    const commentMockData = {
      text: 'edited comment',
    };

    await CommentControllers.editComment({body: commentMockData, userId: 'userId', params: {id: 'commentId'}}, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({message: 'You are Suspended!'});
  });
}

/**
 * @private
 */
function userCanNotEditOthersComment() {
  test('others comment', async () => {
    jest.spyOn(CommentRepository, 'hasCommentExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(CommentRepository, 'getCommentReporterId').mockImplementation((pass, salt, cb) => 'otherUserId');
    jest.spyOn(TicketRepository, 'hasTicketExist').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(TicketRepository, 'isTicketOpen').mockImplementation((pass, salt, cb) => true);
    jest.spyOn(SuspendedUserRepository, 'isUserSuspended').mockImplementation((pass, salt, cb) => false);
    jest.spyOn(UserRepository, 'isNormalUser').mockImplementation((pass, salt, cb) => true);

    const res = mockResponse();
    const commentMockData = {
      text: 'edited comment',
    };

    await CommentControllers.editComment({body: commentMockData, userId: 'userId', params: {id: 'commentId'}}, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({message: 'you can not edit others comment!'});
  });
}

/**
 * @return {{}}
 */
function mockResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
}
