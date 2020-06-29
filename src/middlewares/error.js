/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Error-Handling Middleware
 * 
 * Description:
 *      Sink for all failed endpoints.
 * 
 */

//Lib imports
const HttpStatus = require('http-status-codes');

/**
 * 
 * @param {Object} err Err object.
 * @param {Object} req Request object.
 * @param {Object} res Response object.
 * @param {function} _
 */
const errorHandler = (err, req, res, _) => {
    logger.error({ path: req.path, query: req.query, body: req.body }, `Error on endpoint. Path: {path}, Query: {query}, Body: {body}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error: err.message});
};

module.exports = {
    errorHandler
};
