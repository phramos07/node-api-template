/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      iCustomer Service
 * 
 * Description:
 *      Exports methods to iCustomer integration endpoints.
 * 
 */

// Lib imports
const axios = require('axios');
const http2 = require('http2');

// Module imports
const settings = require.main.require('./config/index').get('iCustomer');

/**
 * Get attendance status in iCustomer for a given messenger ID.
 * @param {string} messenger_id User's ID.
 */
const getAttendanceStatus = async(messenger_id) => {
    try {
        const url = `${settings.url}/${settings.pageId}/users/${messenger_id}/customer-service`;
        const result = await axios ({
            method: http2.constants.HTTP2_METHOD_GET,
            url: url,
            headers: {
                Authorization: settings.authorization
            }
        });

        logger.info({
            url: url, 
            messengerId: messenger_id, 
            result: result 
        }, 'Sucessfully queried {url} for user {messengerId}. Result: {result}');

        const { error, data } = result.data;
        return error ? false : data.service_status;
    } catch(err) {
        logger.error({messengerId: messenger_id, err: err}, 'Error when getting iCustomer user status for {messengerId}: {err}');
    }

    return false;
};

/**
 * Set attendance in iCustomer for a given user.
 * @param {string} messenger_id User's ID.
 * @param {string} status Status can either be 'bot' or 'human'.
 */
const setAttendanceStatus = async(messenger_id, status) => {
    try {
        const url = `${settings.url}/${settings.pageId}/users/${messenger_id}/customer-service`;
        const result = await axios ({
            method: http2.constants.HTTP2_METHOD_POST,
            url: url,
            headers: {
                Authorization: settings.authorization
            },
            data: {
                data: {
                    service_status: status
                }
            }
        });

        logger.info({
            url: url, 
            messengerId: messenger_id, 
            result: result
        }, 'Sucessfully queried {url} for user {messengerId}. Result: {result}');

        const { error, data } = result.data;
        return error ? false : data.service_status;
    } catch(err) {
        logger.error({messengerId: messenger_id, err: err}, 'Error when setting iCustomer user status for {messengerId}: {err}');
    }

    return false;
};

module.exports = {
    getAttendanceStatus,
    setAttendanceStatus
};