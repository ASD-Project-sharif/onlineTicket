const InformationServices = require('../services/information.services');

organizationInformation = async (req, res) => {
  await InformationServices.getOrganizationInformation(req, res);
};

const InformationControllers = {
  organizationInformation,
};

module.exports = InformationControllers;
