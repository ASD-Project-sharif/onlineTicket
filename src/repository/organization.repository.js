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

getOrganizationIdByAgentId = async (adminId) => {
    const agent = await getDocumentById("User", adminId)
    if (agent){
        const organizationId = agent.organization;
        const organization = await getDocumentById("Organization", organizationId);
        if (organization) {
            return organization._id;
        }
        return null
    }
    return null
}


const OrganizationRepository = {
    getOrganizationAdminId,
    hasOrganizationExist,
    getOrganization,
    getOrganizationIdByAgentId
}

module.exports = OrganizationRepository;

