/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Logger module.
 * 
 * Description:
 *      Provides SEQ logging service.
 */

// Lib imports
const bunyan = require('bunyan');
const seq = require('bunyan-seq');

// Module imports
const settings = require.main.require('./config').get('seq');

/**
 * Builds a bunyan client logger connected to the SEQ Server.
 */
const log = bunyan.createLogger({
    name: 'STT',
    streams: [
        {
            stream: process.stdout,
            level: settings.level
        },
        seq.createStream({
            serverUrl: settings.url,
            level: settings.level,
            apiKey: settings.key
        })
    ]
});

module.exports ={
    log
};