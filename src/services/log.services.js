const TicketRepository = require('../repository/ticket.repository');
const UserRepository = require('../repository/user.repository');
const OrganizationRepository = require('../repository/organization.repository');

const TicketLogRepository = require('../repository/ticketLog.repository');

getTicketLogs = async (req, res) => {
  const isAdmin = await UserRepository.isAdmin(req.userId);
  if (!isAdmin) {
    res.status(403).send({message: 'Access Denied'});
    return;
  }

  const ticketOrganizationId = await TicketRepository.getTicketOrganizationId(req.params.id);
  const organizationAdminId = await OrganizationRepository.getOrganizationAdminId(ticketOrganizationId);
  if (organizationAdminId !== req.userId) {
    res.status(403).send({message: 'Access Denied'});
    return;
  }

  res.send({
    logs: await TicketLogRepository.getTicketLogs(req.params.id),
  });
};

const LogServices = {
  getTicketLogs,
};

module.exports = LogServices;
