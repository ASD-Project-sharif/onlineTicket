db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Organization = db.organization;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    // Username
    try {
        const user = await User.findOne({
            username: req.body.username
        }).exec();
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
        const user = await User.findOne({
            email: req.body.email
        }).exec();
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

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }

    next();
};

checkDuplicateOrganizationName = async (req, res, next) => {
    try {
        const organization = await Organization.findOne({
            name: req.body.organizationName,
        }).exec();
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
    checkRolesExisted,
    checkDuplicateOrganizationName,
};

module.exports = verifySignUp;