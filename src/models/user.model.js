const mongoose = require("mongoose");
const UserRole = require("./userRoles");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        name: String,
        email: String,
        password: String,
        role: {
            type: String,
            required: true,
            enum: [UserRole.USER, UserRole.ADMIN, UserRole.AGENT],
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        },

    })
);

module.exports = User;