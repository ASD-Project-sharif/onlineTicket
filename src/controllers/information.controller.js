const InformationServices = require('../services/information.services');

organizationInformation = async (req, res) => {
  await InformationServices.getOrganizationInformation(req, res);
};

organizationInformationByName = async (req, res) => {
  await InformationServices.getOrganizationInformationByName(req, res);
};

const InformationControllers = {
  organizationInformation,
  organizationInformationByName,
};

module.exports = InformationControllers;
