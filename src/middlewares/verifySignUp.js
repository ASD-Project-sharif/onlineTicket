const {findOneDocument} = require("../dataAccess/dataAccess");
db = require("../models");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    // Username
    try {
        const user = await findOneDocument("User", {username: req.body.username})
        if (user) {
            res.status(400).send({message: "Failed! Username is already in use!"});
            return;
        }
    } catch (e) {
        res.status(500).send({message: e});
        return;
    }

    // Email
    try {
        const user = await findOneDocument("User", {email: req.body.email})
        if (user) {
            res.status(400).send({message: "Failed! Email is already in use!"});
            return;
        }
    } catch (e) {
        res.status(500).send({message: e});
        return;
    }
    next();
};

checkDuplicateOrganizationName = async (req, res, next) => {
    try {
        const organization = await findOneDocument("Organization", {name: req.body.organizationName})
        if (organization) {
            res.status(400).send({message: "Failed! OrganizationName is already in use!"});
            return;
        }
    } catch (e) {
        res.status(500).send({message: e});
        return;
    }

    next();

}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkDuplicateOrganizationName,
};

module.exports = verifySignUp;