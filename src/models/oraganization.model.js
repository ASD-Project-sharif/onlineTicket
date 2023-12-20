const mongoose = require("mongoose");

const Organization = mongoose.model(
    "Organization",
    new mongoose.Schema({
        name: String,
        description: String,
        // logo: String,
    })
);

module.exports = Organization