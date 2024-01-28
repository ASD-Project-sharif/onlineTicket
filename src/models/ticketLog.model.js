const mongoose = require('mongoose');
const TimeService = require('../services/time.services')

const TicketLogSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  changes: {
    type: String,
    required: false,
    trim: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: TimeService.now,
  },
});

const TicketLog = mongoose.model('TicketLog', TicketLogSchema);
module.exports = TicketLog;
