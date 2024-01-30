const SuspendedUserServices = require('../services/suspendedUser.services');

suspendUser = async (req, res) => {
  await SuspendedUserServices.suspendUser(req, res);
};

const SuspendedUserControllers = {
  suspendUser,
};

module.exports = SuspendedUserControllers;
