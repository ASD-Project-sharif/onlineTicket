const {
  createDocument,
  findDocuments,
} = require('../dataAccess/dataAccess');

logTicket = async (userId, ticketId, changes, description) => {
  const ticketLog = {
    ticket: ticketId,
    description: description,
    created_by: userId,
    changes: changes,
  };
  return await createDocument('TicketLog', ticketLog);
};

getTicketLogs = async (ticketId) => {
  return await findDocuments(
      'TicketLog',
      {ticket: ticketId},
      {created_at: 1},
      {},
      null,
      null,
      {path: 'created_by', select: 'username'},
  );
};

const TicketLogRepository = {
  logTicket,
  getTicketLogs,
};

module.exports = TicketLogRepository;
