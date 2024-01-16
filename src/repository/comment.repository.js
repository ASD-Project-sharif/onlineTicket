const {
  createDocument,
  getDocumentById,
  updateDocumentById,
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
};

module.exports = CommentRepository;
