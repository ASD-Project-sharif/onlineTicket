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
        return organization.admin._id.toString();
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

getOrganizationByName = async (organizationName) => {
    return await findOneDocument("Organization", {name: organizationName})
}


const OrganizationRepository = {
    getOrganizationAdminId,
    hasOrganizationExist,
    getOrganization,
    getOrganizationByName
}

module.exports = OrganizationRepository;

