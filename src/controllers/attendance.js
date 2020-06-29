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
const PATH = '/attendance';
const ROUTER = express.Router({mergeParams: true});

/**
 *  @swagger
 * /attendance:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *     - "attendance"
 *     summary: "Set user in attendance with BLiP's contact identity."
 *     description: "Set user in attendance with BLiP's contact identity"
 *     parameters:
 *       - in: query
 *         name: contactIdentity
 *         type: "string"
 *         required: true
 *         description: "User's contact identity"
 *     responses:
 *       200:
 *         description: "User now in attendance."
 *       500:
 *         description: "Internal server error."
 */
const setAttendance = async (req, res, next) => {
    try {
        assert(req && req.query && req.query.contactIdentity);
        // set user in attendance
        await facade.setUserInAttendance(req.query.contactIdentity);
        return res.sendStatus(HttpStatus.OK);
    } catch (err) {
        next(err);
    }
};

/**
 *  @swagger
 * /attendance:
 *   delete:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *     - "attendance"
 *     summary: "Remove user out of attendance with BLiP's contact identity."
 *     description: "Remove user out of attendance with BLiP's contact identity"
 *     parameters:
 *       - in: query
 *         name: contactIdentity
 *         type: "string"
 *         required: true
 *         description: "User's contact identity"
 *     responses:
 *       204:
 *         description: "User now out of attendance."
 *       500:
 *         description: "Internal server error."
 */
const deleteAttendance = async (req, res, next) => {
    try {
        assert(req && req.query && req.query.contactIdentity);
        await facade.setUserOutOfAttendance(req.query.contactIdentity);
        return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (err) {
        next(err);
    }
    // set user out of attendance
};

/**
 *  @swagger
 * /attendance:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *     - "attendance"
 *     summary: "Check if user is in attendance at iCustomer."
 *     description: "Check if user is in attendance at iCustomer."
 *     parameters:
 *       - in: query
 *         name: contactIdentity
 *         type: "string"
 *         required: true
 *         description: "User's contact identity"
 *     responses:
 *       200:
 *         description: "User in attendance."
 *       204:
 *         description: "User not in attendance."
 *       500:
 *         description: "Internal server error."
 */
const getAttendance = async (req, res, next) => {
    try {
        assert(req && req.query && req.query.contactIdentity);
        // check if user is attendance
        const result = await facade.checkUserInAttendance(req.query.contactIdentity);
        return result ? res.sendStatus(HttpStatus.OK) : res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (err) {
        next(err);
    }
};

ROUTER.post('/', setAttendance);
ROUTER.delete('/', deleteAttendance);
ROUTER.get('/', getAttendance);

module.exports = {
    PATH,
    ROUTER
};