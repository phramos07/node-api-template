/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Blip Service
 * 
 * Description:
 *      Exports methods to major BLiP endpoints.
 * 
 */

// Lib imports
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const http2 = require('http2');

// Module imports
const settings = require.main.require('./config/index');
const blip = settings.get('blip');
const defaultContact = settings.get('defaultContact');

/**
 * Sends message to contact identity.
 * @param {string} key Bot's key.
 * @param {string} contact_identity Contact's identity.
 * @param {string} message Message to be sent.
 */
const sendMessage = async (key, contact_identity, message) => {
    try {
        const result = await axios({
            method: http2.constants.HTTP2_METHOD_POST,
            url: `${blip.msgingUrl}/messages`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: key
            }, 
            data: {
                id: uuidv4(),
                to: contact_identity,
                type: 'text/plain',
                content: message
            }
        });

        return result.data.status !== 'failure';
    } catch (err) {
        logger.error({
            contactIdentity: contact_identity,
            key: key,
            err: err
        },
        `Error at BLiP /message request: ${err.message}`);
    }

    return false;
};

/**
 * Request to /commands in Blip with the specified command object.
 * @param {string} key Bot's access key.
 * @param {Object} command Command object.
 */
const executeCommand = async (key, command={}) => {
    try {
        const result = await axios({
            method: http2.constants.HTTP2_METHOD_POST,
            url: `${blip.msgingUrl}/commands`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: key
            }, 
            data: {
                id: uuidv4(),
                ...command
            }
        });

        return result.data.status !== 'failure' ? result.data : false;
    } catch (err) {
        logger.error({
            contactIdentity: contact_identity,
            key: key,
            err: err
        },
        `Error at BLiP /commands request: ${err.message}`);
    }

    return false;
}; 

/**
 * Retrieves BLiP's contact.
 * @param {string} key Bot's key.
 * @param {string} contact_identity Contact's identity.
 */
const getContact = async (key, contact_identity) => {
    const command = {
        method: 'get',
        uri: `/contacts/${contact_identity}`
    };

    return executeCommand(key, command);
};

/**
 * Creates a contact in BLiP
 * @param {string} key Bot's key
 * @param {string} contact  Contact's identity
 */
const createContact = async (key, contact) => {
    const command = {
        method: 'set',
        uri: '/contacts',
        type: 'application/vnd.lime.contact+json',
        resource: {
            ...defaultContact,
            ...contact
        }
    };

    return executeCommand(key, command);
};

/**
 * Sets  contact to a given context.
 * @param {string} key Bot's key.
 * @param {string} flow_id Flow's ID.
 * @param {string} contact_identity Contact's identity.
 * @param {string} context Context's ID.
 */
const setContext = async (key, flow_id, contact_identity, context) => {
    const command = {
        to: 'postmaster@msging.net',
        method: 'set',
        uri: `/contexts/${contact_identity}/stateid%40${flow_id}`,
        type: 'text/plain',
        resource: context
    };

    return executeCommand(key, command);
};


module.exports = {
    getContact,
    createContact,
    setContext,
    sendMessage
};
