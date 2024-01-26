const {
  getDocumentById,
  createDocument,
  findOneDocument,
} = require('../dataAccess/dataAccess');
const UserRole = require('../models/enums/userRoles.enum');

hasUserExist = async (userId) => {
  const user = await getDocumentById('User', userId);
  return user !== null;
};

isNormalUser = async (userId) => {
  const user = await getDocumentById('User', userId);
  return user.role === UserRole.USER;
};

isAdmin = async (userId) => {
  const user = await getDocumentById('User', userId);
  return user.role === UserRole.ADMIN;
};

isAgent = async (userId) => {
  const user = await getDocumentById('User', userId);
  return user.role === UserRole.AGENT;
};

isOrganizationUser = async (userId) => {
  const user = await getDocumentById('User', userId);
  return user.role === UserRole.ADMIN || user.role === UserRole.AGENT;
};

createNewUser = async (data) => {
  return await createDocument('User', data);
};

getByUsername = async (username) => {
  return await findOneDocument('User', {username: username});
};

const UserRepository = {
  hasUserExist,
  isNormalUser,
  isAdmin,
  isAgent,
  isOrganizationUser,
  createNewUser,
  getByUsername,
};

module.exports = UserRepository;
