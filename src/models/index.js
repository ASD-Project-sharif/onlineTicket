const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user.model');
db.organization = require('./oraganization.model');
db.ticket = require('./ticket.model');
db.suspended_user = require('./suspendedUser.model');
db.comment = require('./comment.model');
db.product = require('./product.model');
db.ticket_log = require('./ticketLog.model')

db.ROLES = ['user', 'admin', 'agent'];

module.exports = db;
