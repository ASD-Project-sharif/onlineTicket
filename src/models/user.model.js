const mongoose = require('mongoose');
const UserRole = require('./enums/userRoles.enum');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
      username: String,
      name: String,
      email: String,
      password: String,
      role: {
        type: String,
        required: true,
        enum: Object.values(UserRole),
      },
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
      },

    }),
);

module.exports = User;
