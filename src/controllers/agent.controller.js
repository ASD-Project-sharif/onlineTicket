const AgentServices = require('../services/agent.services');

addAgent = async (req, res) => {
  await AgentServices.addNewAgent(req, res);
};

getAgents = async (req, res) => {
  await AgentServices.getAgents(req, res);
};


const AgentControllers = {
  addAgent,
  getAgents,
};

module.exports = AgentControllers;
