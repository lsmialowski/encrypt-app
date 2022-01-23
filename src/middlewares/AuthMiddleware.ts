import * as jwt from 'jsonwebtoken';
import * as config from 'nconf';
import {ExpressMiddlewareInterface, HttpError, Middleware} from 'routing-controllers';
import { Service } from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import IJwtConfig from '../common/config/IJwtConfig';
import UserRepository from '../repositories/UserRepository';

@Middleware({type: 'before'})
@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {

    private whiteListUrls = [
        '/api/register',
        '/api/sign-in',
    ];

    @InjectRepository()
    private readonly userRepository: UserRepository;

    public async use(request: any, response: any, next: any) {
        if (this.whiteListUrls.includes(request.url)) {
            return next();
        }

        if (!request.headers['authorization']) {
            throw new HttpError(410, 'An authorization token is missing');
        }
        const token = getToken(request.headers['authorization']);
        const jwtConfig: IJwtConfig = config.get('jwt');
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, jwtConfig.secret) as any;
        } catch (error: any) {
            throw new HttpError(410, typeof error === 'object' ? error.message : 'Gone');
        }

        request.user = await this.userRepository.findOne({email: decodedToken.email});
        next();
    }
}

function getToken(token: string) {
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    return token;
}
