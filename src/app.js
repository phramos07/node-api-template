/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      App
 * 
 * Description:
 *      Main entry point for the API.
 * 
 */

// Lib imports
const express = require('express');
const swagger_ui = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');

// Module imports
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error');
const logger = require('./logger/index');
const packageInfo = require('../package.json');
const api = require('./config/index').get('api');
const parentRouter = require('./controllers/router');

// Constants
const ROUTES_PATH = './src/controllers/*.js';
const PORT = process.env.PORT || 3333;
const ETAG = 'etag';

class App {
    constructor() {
        this.app = express();
    }

    build() {
        this.setupLogger();
        this.setupPreRoutesMiddlewares();
        this.setupRoutes();
        this.setupPosRoutesMiddlewares();
    }

    start() {
        this.app.listen(PORT, () => {
            logger.log.info(`Server running on ${PORT} port.`);
        });
    }

    setupPreRoutesMiddlewares() {
        this.app.disable(ETAG);
        this.app.use(bodyParser.json());
    }

    setupPosRoutesMiddlewares() {
        this.setupSwagger();
        this.app.use(errorHandler);
    }

    setupSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: packageInfo.name,
                    version: packageInfo.version,
                    description: packageInfo.description
                },
                securityDefinitions: {
                    BasicAuth: api.swaggerDefinitions.basicAuth,
                    ApiKeyAuth: {
                        type: api.swaggerDefinitions.type,
                        'in': api.swaggerDefinitions.in,
                        name: api.swaggerDefinitions.name
                    }
                },
                basePath: api.baseRoute
            },
            apis: [ROUTES_PATH]
        };
    
        // Starting swagger
        const specs = swaggerJSDoc(options);
        this.app.use(
            api.swaggerDefinitions.route,
            swagger_ui.serve,
            swagger_ui.setup(specs)
        );
    }

    setupRoutes() {
        this.app.use(api.baseRoute, auth, parentRouter.router);
    }

    setupLogger() {
        global.logger = logger.log;
    }
}

module.exports = {
    App
};
