const bcrypt = require('bcryptjs');
const PasswordValidator = require('password-validator');

const isPasswordDifficultEnough = (password) => {
  const passwordSchema = new PasswordValidator();
  passwordSchema.is().
      min(8).
      has().
      uppercase().
      has().
      lowercase().
      has().
      digits().
      has().
      symbols();
  return passwordSchema.validate(password, {list: true}).length === 0;
};

const arePasswordsEqual = (userInoutPassword, dbPassword) => {
  return bcrypt.compareSync(
      userInoutPassword,
      dbPassword,
  );
};

const getPasswordHash = (password) => {
  return bcrypt.hashSync(password, 8);
};

const PasswordServices = {
  isPasswordDifficultEnough,
  arePasswordsEqual,
  getPasswordHash,
};

module.exports = PasswordServices;
