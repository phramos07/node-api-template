/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Server
 * 
 * Description:
 *      Main entry point for the API. Starts the Application.
 * 
 */

const { App } = require('./app');

(async () => {
    const app = new App();
    app.build();
    app.start();
})();