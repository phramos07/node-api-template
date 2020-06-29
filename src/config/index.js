/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Settings Service.
 * 
 * Description:
 *      Retrieves settings for major services.
 * 
 */

// Module imports
const config = require('./default.json');
const assert = require('assert');

/**
 * Retrieves desired portion of settings file.
 * @param {string} key 
 */
const get = (key='') => {
    assert(key && config[key]);
    return config[key];
}; 

module.exports = { 
    get
};
