const UserRepository = require('../repository/user.repository');
const OrganizationRepository = require('../repository/organization.repository');
const UserRole = require('../models/enums/userRoles.enum');
const PasswordServices = require('./password.services');

addNewAgent = async (req, res) => {
  if (!PasswordServices.isPasswordDifficultEnough(req.body.password)) {
    res.status(400).send({message: 'password is not difficult enough!'});
    return;
  }
  if (req.body.password !== req.body.confirm) {
    res.status(400).send({message: 'passwords are different!'});
    return;
  }

  const isAdmin = await UserRepository.isAdmin(req.userId);
  if (!isAdmin) {
    res.status(403).send({message: 'you do not have the right access!'});
    return;
  }

  const user = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: PasswordServices.getPasswordHash(req.body.password),
    role: UserRole.AGENT,
    organization: await OrganizationRepository.getOrganizationIdByAgentId(req.userId),
  };
  await UserRepository.createNewUser(user);
  res.send({message: 'User was registered successfully!'});
};

getAgents = async (req, res) => {
  const organizationId = await OrganizationRepository.getOrganizationIdByAgentId(req.userId);
  const agents = await UserRepository.getAgents(organizationId, req.query.pageNumber, req.query.pageSize, req.userId);
  res.send({agents: agents});
};

const AgentServices = {
  addNewAgent,
  getAgents,
};

module.exports = AgentServices;
