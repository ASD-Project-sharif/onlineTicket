const mongoose = require("mongoose");

const Organization = mongoose.model(
    "User",
    new mongoose.Schema({
        name: String,
        description: String,
        // logo: String,
    })
);

module.exports = Organization