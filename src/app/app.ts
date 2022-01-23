import bodyParser = require('body-parser');
import * as express from 'express';
import { Action, useContainer as routingUseContainer, useExpressServer } from 'routing-controllers';
import { Container as typeDiContainer } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { Container as ormTypeDiContainer } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import database from './database';

export default async (): Promise<express.Application> => {
    const logger: Logger = typeDiContainer.get('logger');

    /** Tells TypeOrm to use TypeDI Container (Required!)
     *
     * @see https://github.com/typestack/typedi#troubleshooting
     */
    ormUseContainer(ormTypeDiContainer);

    logger.info('Initiating database connection');
    await database().catch((error: Error) => {
        logger.error(`Unable to connect to database. ${error.message}`, error.stack);
        throw error;
    });
    logger.info('Connected to database');

    /** Tells Routing Controllers to use TypeDI Container (Required!)
     *
     * @see https://github.com/typestack/typedi#troubleshooting
     */
    routingUseContainer(typeDiContainer);

    const app = express();
    app.use(bodyParser.json());

    return useExpressServer(app, {
        routePrefix: '/api',
        controllers: [process.env.APP_ROOT + '/build/controllers/*Controller.js'],
        middlewares: [process.env.APP_ROOT + '/build/middlewares/*.js'],
        development: false,
        currentUserChecker: async (action: Action) => {
            return action.request.user;
        },
    });
};
