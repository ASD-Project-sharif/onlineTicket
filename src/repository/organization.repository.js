const {
  findOneDocument,
  getDocumentById,
  createDocument,
  updateDocumentById,
} = require('../dataAccess/dataAccess');

getOrganizationAdminId = async (organizationId) => {
  const organization = await getDocumentById('Organization', organizationId);
  return organization.admin._id.toString();
};

hasOrganizationExist = async (organizationId) => {
  const organization = await getDocumentById('Organization', organizationId);
  return organization !== null;
};

getOrganization = async (organizationId) => {
  return await getDocumentById('Organization', organizationId);
};


getOrganizationByName = async (organizationName) => {
  return await findOneDocument('Organization', {name: organizationName});
};

createNewOrganization = async (data) => {
  return await createDocument('Organization', data);
};
editOrganization = async (id, data) => {
  return await updateDocumentById('Organization', id, data);
};


getOrganizationIdByAgentId = async (adminId) => {
  const agent = await getDocumentById('User', adminId);
  if (agent) {
    const organizationId = agent.organization;
    const organization = await getDocumentById('Organization', organizationId);
    if (organization) {
      return organization._id.toString();
    }
    return null;
  }
  return null;
};


const OrganizationRepository = {
  getOrganizationAdminId,
  hasOrganizationExist,
  getOrganization,
  getOrganizationIdByAgentId,
  getOrganizationByName,
  createNewOrganization,
  editOrganization,
};

module.exports = OrganizationRepository;

