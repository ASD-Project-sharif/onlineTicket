const {
    findOneDocument,
    createDocument,
    mongooseClient,
    getDocumentById,
    countDocuments
} = require("../dataAccess/dataAccess");


isUserSuspended = async (userId, organizationId) => {
    const suspendedUser = await findOneDocument(
        "SuspendedUser",
        {
            user: userId,
            organization: organizationId
        });
    return suspendedUser !== null;
}


const SuspendedUserRepository = {
    isUserSuspended,
}

module.exports = SuspendedUserRepository;

