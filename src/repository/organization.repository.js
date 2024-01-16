const {
  findOneDocument,
  getDocumentById,
  createDocument,
  updateDocumentById,
} = require('../dataAccess/dataAccess');

getOrganizationAdminId = async (organizationId) => {
  const organization = await getDocumentById('Organization', organizationId);
  if (organization) {
    return organization.admin._id.toString();
  }
  return null;
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

const OrganizationRepository = {
  getOrganizationAdminId,
  hasOrganizationExist,
  getOrganization,
  getOrganizationByName,
  createNewOrganization,
  editOrganization,
};

module.exports = OrganizationRepository;
