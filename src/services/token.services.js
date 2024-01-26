let jwt = require("jsonwebtoken");


const generateToken = (userID) => {
    return jwt.sign({id: userID},
        '123',
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });
}


module.exports = {
    generateToken,

}