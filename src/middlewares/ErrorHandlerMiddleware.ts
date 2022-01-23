import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import {Logger} from 'winston';

@Middleware({type: 'after'})
@Service()
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

    @Inject('logger')
    private logger: Logger;

    public error(error: any, request: Express.Request, response: Express.Response, next: (err?: any) => any) {
        this.logger.error(error.message, error.stack);

        next(error);
    }
}
