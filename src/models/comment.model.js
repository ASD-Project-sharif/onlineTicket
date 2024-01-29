const mongoose = require('mongoose');

const TimeService = require('../services/time.services');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  created_at: {
    type: Date,
    default: TimeService.now,
    required: true,
  },
  updated_at: {
    type: Date,
    default: TimeService.now,
    required: true,
  },
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
