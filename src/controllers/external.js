/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Attendance controller
 * 
 * Description:
 *      Handles bot's attendance through API
 * 
 */

// Lib imports
const express = require('express');
const assert = require('assert');
const HttpStatus = require('http-status-codes');

// Module imports
const facade = require.main.require('./facades/attendance');

// Constants
const PATH = '/external';
const ROUTER = express.Router({mergeParams: true});
const MESSENGER_DOMAIN = '@messenger.gw.msging.net';
const SERVICE_STATUS = {
    HUMAN: 'human',
    BOT: 'bot'
};

/**
 *  @swagger
 * /external:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *     - "external"
 *     summary: "Remove user out of attendance with messenger ID."
 *     description: "Remove user out of attendance with messenger ID"
 *     parameters:
 *       - in: body
 *         name: body
 *         type: "object"
 *         required: true
 *         description: "Icustomer user data."
 *         schema:
 *           type: "object"
 *           properties:
 *             data:
 *               type: "object"
 *               properties:
 *                 user_id:
 *                   type: "string"
 *                 service_status:
 *                   type: "string"
 *     responses:
 *       204:
 *         description: "User now out of attendance."
 *       500:
 *         description: "Internal server error."
 */
const attendance = async (req, res, next) => {
    try {
        assert(req.body && req.body.data && req.body.data.user_id && req.body.data.service_status);
        const { service_status } = req.body.data;
        // set user out of attendance
        if (service_status == SERVICE_STATUS.BOT) {
            await facade.setUserOutOfAttendance(`${req.body.data.user_id}${MESSENGER_DOMAIN}`, true);
            res.status(HttpStatus.NO_CONTENT).send('User sucessfully set out of attendance.');
        } else if (service_status == SERVICE_STATUS.HUMAN) {
            await facade.setUserInAttendance(`${req.body.data.user_id}${MESSENGER_DOMAIN}`, true);
            res.status(HttpStatus.OK).send('User sucessfully set in attendance.');
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Cannot recognize service status provided.');
        }

    } catch (err) {
        next(err);
    }
};

ROUTER.post('/', attendance);

module.exports = {
    PATH,
    ROUTER
};