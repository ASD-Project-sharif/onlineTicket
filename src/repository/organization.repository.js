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
    getOrganizationIdByAgentId,
}

module.exports = OrganizationRepository;

