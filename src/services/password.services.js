let bcrypt = require("bcryptjs");
const passwordValidator = require('password-validator');

const isPasswordDifficultEnough = (password) => {
    const passwordSchema = new passwordValidator();
    passwordSchema
        .is().min(8)
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().symbols();
    return passwordSchema.validate(password, {list: true}).length === 0;
}

const arePasswordsEqual = (dbPassword, userInoutPassword) => {
    return bcrypt.compareSync(
        userInoutPassword,
        dbPassword
    );
}


module.exports = [
    isPasswordDifficultEnough,
    arePasswordsEqual
]



