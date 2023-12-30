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


const OrganizationRepository = {
    getOrganizationAdminId,
}

module.exports = OrganizationRepository;

