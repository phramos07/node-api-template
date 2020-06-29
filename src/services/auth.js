/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Auth service
 * 
 * Description:
 *      Checks if the authorization token is valid.
 * 
 */
const api = require.main.require('./config/index').get('api');

/**
 * Checks if authorization token is valid.
 * @param {string} token Authorization token.
 */
const checkToken = (token) => {
    return token == api.authToken;
};

module.exports = { checkToken };