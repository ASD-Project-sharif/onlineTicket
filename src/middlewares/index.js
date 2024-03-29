const authJwt = require('./authJwt');
const verifySignUp = require('./verifySignUp');

/**
 * @param {int} number
 * @return {boolean}
 */
function isEven(number) {
  if (number < 0) throw new Error('Number must be positive');
  if (typeof number !== 'number') throw new Error('Number must be a number');
  return number % 2 === 0;
}

module.exports = {
  authJwt,
  verifySignUp,
  isEven,
};
