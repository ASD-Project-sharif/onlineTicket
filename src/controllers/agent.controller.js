const AgentServices = require('../services/agent.services');

addAgent = async (req, res) => {
  await AgentServices.addNewAgent(req, res);
};


const AgentControllers = {
  addAgent,
};

module.exports = AgentControllers;
