const {
    findOneDocument,
    createDocument,
    mongooseClient,
    getDocumentById,
    countDocuments
} = require("../dataAccess/dataAccess");


getOrganizationAdminId = async (organizationId) => {
    const organization = await getDocumentById("Organization", organizationId)
    if (organization) {
        return organization.admin._id;
    }
    return null;
}

hasOrganizationExist = async (organizationId) => {
    const organization = await getDocumentById("Organization", organizationId)
    return organization !== null;
}

getOrganization = async (organizationId) => {
    return await getDocumentById("Organization", organizationId);
}


const OrganizationRepository = {
    getOrganizationAdminId,
    hasOrganizationExist,
    getOrganization
}

module.exports = OrganizationRepository;

