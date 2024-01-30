const OrganizationRepository = require('../repository/organization.repository');
const SuspendedUserRepository = require('../repository/suspendedUser.repository');

suspendUser = async (req, res) => {
  const organizationId = await OrganizationRepository.getOrganizationIdByAgentId(req.userId);
  if (!organizationId) {
    res.status(400).send({message: 'Organization does not exist!'});
    return;
  }
  const ban = Boolean(req.body.suspend);
  const isUserSuspended = await SuspendedUserRepository.isUserSuspended(req.body.id, organizationId);

  if (isUserSuspended && !ban) {
    await SuspendedUserRepository.unSuspendUser(req.body.id, organizationId);
    res.send({message: 'User is ok now!'});
    return;
  }

  if (!isUserSuspended && ban) {
    await SuspendedUserRepository.suspendUser(req.body.id, organizationId, req.userId);
    res.send({message: 'User is suspended!'});
    return;
  }

  res.status(304).send({message: 'nothing changed'});
};

const SuspendedUserServices = {
  suspendUser,
};

module.exports = SuspendedUserServices;
