const CommentServices = require("../services/comment.services");

addComment = async (req, res) => {
    await CommentServices.createComment(req, res);
};

editComment = async (req, res) => {
    await CommentServices.editComment(req, res);
}

const CommentControllers = {
    addComment,
    editComment
}

module.exports = CommentControllers;