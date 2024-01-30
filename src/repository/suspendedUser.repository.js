const {
  findOneDocument,
  deleteDocumentById,
  createDocument,
} = require('../dataAccess/dataAccess');

isUserSuspended = async (userId, organizationId) => {
  const suspendedUser = await findOneDocument(
      'SuspendedUser',
      {
        user: userId,
        organization: organizationId,
      });
  return suspendedUser !== null;
};

unSuspendUser = async (userId, organizationId) => {
  const suspendedUser = await findOneDocument(
      'SuspendedUser',
      {
        user: userId,
        organization: organizationId,
      });
  if (suspendedUser) {
    await deleteDocumentById('SuspendedUser', suspendedUser._id);
  }
};

suspendUser = async (suspendedUserId, organizationId, userId) => {
  await createDocument('SuspendedUser', {
    user: suspendedUserId,
    organization: organizationId,
    suspended_by: userId,
  });
};

const SuspendedUserRepository = {
  isUserSuspended,
  unSuspendUser,
  suspendUser,
};

module.exports = SuspendedUserRepository;
