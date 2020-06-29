/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Attendance facade.
 * 
 * Description:
 *      Deals with the logic behind setting an user in and out of
 * attendance both in BLiP and iCustomer.
 * 
 */

// Module imports
const blip = require.main.require('./services/blip');
const icustomer = require.main.require('./services/icustomer');
const bot = require.main.require('./config/index').get('bot');

/**
 * Sets user in attendance by setting a contact
 * identity to a specific context in the builder. It also
 * sets user in attendance at iCustomer panel as well.
 * @param {string} contact_identity BLiP's contact identity.
 */
const setUserInAttendance = async (contact_identity, external=false) => {
    const messenger_id = contact_identity.split('@')[0];

    const blip_contact = await blip.getContact(bot.key, contact_identity);
    if (!blip_contact) {
        await blip.createContact(bot.key, { identity: contact_identity });
    }

    const set_context_response = await setUserInContext(contact_identity, bot.attendanceStartId);
    const set_status_response = external || (await icustomer.setAttendanceStatus(messenger_id, 'human'));

    if (!set_context_response || !set_status_response) {
        logger.warn({contactIdentity: contact_identity}, 'Error when setting user {contactIdentity} in attendance.');
        throw new Error('Error when setting user in attendance.');
    }
};

/**
 * Sets user out of attendance by setting a contact
 * identity to a specific context in the builder.
 * @param {string} contact_identity BLiP's contact identity.
 */
const setUserOutOfAttendance = async (contact_identity, external=false) => {
    const messenger_id = contact_identity.split('@')[0];

    const set_context_response = await setUserInContext(contact_identity, bot.attendanceEndId);
    const set_status_response = external || (await icustomer.setAttendanceStatus(messenger_id, 'bot'));

    if (!set_context_response || !set_status_response) {
        logger.warn({contactIdentity: contact_identity}, 'Error when setting user {contactIdentity} out of attendance.');
        throw new Error('Error when setting user out of attendance.');
    }

    await blip.sendMessage(bot.key, contact_identity, bot.surveyMessage);
};

/**
 * Checks if user is in attendance at iCustomer.
 * @param {string} contact_identity BLiP's contact identity.
 */
const checkUserInAttendance = async(contact_identity) => {
    const messenger_id = contact_identity.split('@')[0];
    
    const response = await icustomer.getAttendanceStatus(messenger_id);

    if (!response) {
        logger.warn({contactIdentity: contact_identity}, 'Error when checking user {contactIdentity} is in attendance.');
        throw new Error('Error when checking user in attendance');
    }
  
    return response == 'human';
};

const setUserInContext = async (contact_identity, context_id) => {
    if (!contact_identity) {
        throw new Error('id cannnot be null');
    }

    const blip_contact = await blip.getContact(bot.key, contact_identity);
  
    if (!blip_contact) {
        logger.error({bot: bot.key, contactIdentity: contact_identity}, 'Could not find contact: {contactIdentity} in bot: {bot}');
        throw new Error('Cannot find contact in bot.');
    }

    return blip.setContext(bot.key, bot.flowId, contact_identity, context_id);
};

module.exports = {
    setUserInAttendance,
    setUserOutOfAttendance,
    checkUserInAttendance
};