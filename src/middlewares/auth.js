/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Authorization Middleware
 * 
 * Description:
 *      Intercepts requests and validates authorization header.
 * 
 */

// Lib imports
const HttpStatus = require('http-status-codes');

// Module imports
const { checkToken } = require.main.require('./services/auth');

/**
 * 
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {function} next Iterator to the next method in the HTTP Request pipeline
 */
const auth = async (req, res, next) => {
    if (!req.query || !req.query.accessToken) {
        return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    const auth_token = req.query.accessToken;
    if (checkToken(auth_token)) {
        return next();
    } else {
        return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
};

module.exports = {
    auth
};
