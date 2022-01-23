import * as config from 'nconf';
import {Container} from 'typedi';
import {Logger} from 'winston';
import application from './app';

export default async () => {
    const logger: Logger = Container.get('logger');

    const app = await application();
    const port = config.get('port') || 3000;

    app.listen(port, () => {
        logger.info('Application listening on port ' + port);
    });
};
