import * as jwt from 'jsonwebtoken';
import * as config from 'nconf';
import {BadRequestError, UnauthorizedError} from 'routing-controllers';
import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import IJwtConfig from '../common/config/IJwtConfig';
import AuthDto from '../dtos/AuthDto';
import AuthSignInDto from '../dtos/AuthSignInDto';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Service()
export default class AuthService {

    @InjectRepository()
    private readonly userRepository: UserRepository;
    private readonly jwtConfig: IJwtConfig;

    constructor() {
        this.jwtConfig = config.get('jwt');
    }

    public async register(data: AuthDto) {
        if (await this.userRepository.checkIfExist(data.email)) {
            throw new BadRequestError(`User with mail ${data.email} already exists`);
        }

        const password: string = this.encodePassword(data.password);
        const user: User = await this.userRepository.save<Partial<User>>({
            email: data.email,
            password,
        });

        return {
            email: user.email,
        };
    }

    public async signIn(credentials: AuthSignInDto) {
        const user: User = await this.userRepository.findOneOrFail({email: credentials.email})
            .catch(() => {
                throw new UnauthorizedError('Invalid credentials');
            });

        if (!compareSync(credentials.password, user.password)) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const authToken: string = jwt.sign(
            {email: credentials.email},
            this.jwtConfig.secret,
            this.jwtConfig.options,
        );

        return {
            authToken,
        };
    }

    private encodePassword(password: string): string {
        const salt: string = genSaltSync();

        return hashSync(password, salt);
    }
}
