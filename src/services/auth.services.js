const {findOneDocument, createDocument, updateDocumentById} = require("../dataAccess/dataAccess");
const UserRole = require("../models/enums/userRoles.enum");
const {isPasswordDifficultEnough, arePasswordsEqual, getPasswordHash} = require("./password.services")
const {generateToken} = require("./token.services")
const mongoose = require("mongoose");

signup = async (req, res) => {
    if (!isPasswordDifficultEnough(req.body.password)) {
        res.status(400).send({message: "password is not difficult enough!"})
        return;
    }
    if (req.body.password !== req.body.confirm) {
        res.status(400).send({message: "passwords are different!"});
        return;
    }

    const user = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: getPasswordHash(req.body.password),
        role: UserRole.USER
    };
    await createDocument("User", user)
    res.send({message: "User was registered successfully!"});
}

signupOrganization = async (req, res) => {
    if (!isPasswordDifficultEnough(req.body.password)) {
        res.status(400).send({message: "password is not difficult enough!"})
        return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const organizationData = {
            name: req.body.organizationName,
            description: req.body.organizationDescription
        }
        const organization = await createDocument("Organization", organizationData)
        const organizationUser = {
            username: req.body.username,
            email: req.body.email,
            password: getPasswordHash(req.body.password),
            organization: organization._id,
            role: UserRole.ADMIN
        };

        const admin = await createDocument("User", organizationUser);

        organization.admin = admin._id;
        await updateDocumentById("Organization", organization._id, organization);

        await session.commitTransaction();
        res.send({message: "Admin was registered successfully!"});
    } catch (e) {
        await session.abortTransaction();
        throw e;
    } finally {
        await session.endSession();
    }
};

signIn = async (req, res) => {
    const user = await findOneDocument("User", {username: req.body.username});
    if (!user) {
        return res.status(404).send({message: "User and Password combination is incorrect."});
    }
    const passwordIsValid = arePasswordsEqual(
        req.body.password,
        user.password,
    );
    if (!passwordIsValid) {
        return res.status(404).send({message: "User and Password combination is incorrect."});
    }

    const authority = "ROLE_" + user.role.toUpperCase();
    res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        role: authority,
        accessToken: generateToken(user.id)
    });
};


const AuthServices = {
    signup,
    signupOrganization,
    signIn
}

module.exports = AuthServices;