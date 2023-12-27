const mongoose = require("mongoose");

const Organization = mongoose.model(
    "Organization",
    new mongoose.Schema({
        name: String,
        description: String,
        // logo: String,
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    })
);

module.exports = Organization