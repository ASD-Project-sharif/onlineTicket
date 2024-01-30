const InformationServices = require('../services/information.services');

organizationInformation = async (req, res) => {
  await InformationServices.getOrganizationInformation(req, res);
};


getOrganizationInformationByUserId = async (req, res) => {
  await InformationServices.getOrganizationInformationByUserId(req, res);
};

const InformationControllers = {
  organizationInformation,
  getOrganizationInformationByUserId,
};

module.exports = InformationControllers;
