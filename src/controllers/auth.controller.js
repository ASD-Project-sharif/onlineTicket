let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const {findOneDocument, createDocument} = require("../dataAccess/dataAccess");
const UserRole = require("../models/userRoles");

signup = async (req, res) => {
    const user = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: UserRole.USER
    };

    try {
        await createDocument("User", user)
        res.send({message: "User was registered successfully!"});
    } catch (e) {
        res.status(500).send({message: e});
    }


};

signupOrganization = async (req, res) => {
    const organization = {
        name: req.body.organizationName,
        description: req.body.organizationDescription
    }
    const organizationInfo = await createDocument("Organization", organization)
    const organizationUser = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        organization: organizationInfo._id,
        role: UserRole.ADMIN
    };

    try {
        await createDocument("User", organizationUser);
        res.send({message: "Admin was registered successfully!"});
    } catch (e) {
        res.status(500).send({message: e});
    }


};

signin = async (req, res) => {
    try {
        const user = await findOneDocument("User", {username: req.body.username});
        if (!user) {
            return res.status(404).send({message: "User Not found."});
        }

        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({id: user.id},
            process.env.SECRET_KEY,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

        let authority = "ROLE_" + user.role.toUpperCase();

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            role: authority,
            accessToken: token
        });
    } catch (e) {
        res.status(500).send({message: e});
        console.log(e)
    }

};

const AuthControllers = {
    signup,
    signupOrganization,
    signin
}

module.exports = AuthControllers;