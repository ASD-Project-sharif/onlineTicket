const {
  createDocument,
  getDocumentById,
  updateDocumentById,
  findDocuments,
} = require('../dataAccess/dataAccess');

hasCommentExist = async (commentId) => {
  const comment = await getDocumentById('Comment', commentId);
  return comment !== null;
};

getCommentReporterId = async (commentId) => {
  const comment = await getDocumentById('Comment', commentId);
  return comment.created_by._id.toString();
};

getCommentTicketId = async (commentId) => {
  const comment = await getDocumentById('Comment', commentId);
  return comment.ticket._id.toString();
};

getTicketComments = async (ticketId) => {
  const populate = {
    path: 'created_by',
    select: 'username',
  };
  return await findDocuments(
      'Comment',
      {ticket: ticketId},
      {created_at: 1},
      {},
      null,
      null,
      populate);
};

createNewComment = async (data) => {
  return await createDocument('Comment', data);
};

editComment = async (id, data) => {
  return await updateDocumentById('Comment', id, data);
};

const CommentRepository = {
  createNewComment,
  editComment,
  getCommentReporterId,
  hasCommentExist,
  getCommentTicketId,
  getTicketComments,
};

module.exports = CommentRepository;
