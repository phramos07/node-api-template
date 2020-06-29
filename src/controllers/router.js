/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Router
 * 
 * Description:
 *      Define routes for API methods on express router.
 * 
 */

/**
 * Lib imports
 */
const express = require('express');

/**
 * Module imports
 */
const root = require.main.require('./controllers/root');
const attendance = require.main.require('./controllers/attendance');
const external = require.main.require('./controllers/external');

/**
 * Set up routes.
 */
const router = express.Router();
router.get(root.PATH, root.welcomeMessage);
router.use(attendance.PATH, attendance.ROUTER);
router.use(external.PATH, external.ROUTER);

module.exports = {
    router
};