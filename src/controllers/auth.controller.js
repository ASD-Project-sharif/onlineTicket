const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    try {
        await user.save();
        if (req.body.role) {
            const role = await Role.findOne({name: {$in: req.body.role}});
            user.role = role._id;
            await user.save();
            res.send({message: "User was registered successfully!"});
        } else {
            const role = await Role.findOne({name: "user"});
            user.role = role._id;
            user.save();
            res.send({message: "User was registered successfully!"});
        }
    } catch (e) {
        res.status(500).send({message: e});
    }


};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        })
            .populate("role", "-__v")
            .exec();

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
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

        let authority = "ROLE_" + user.role.name.toUpperCase();

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