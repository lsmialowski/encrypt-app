import {generateKeyPairSync} from 'crypto';
import * as config from 'nconf';
import {Service} from 'typedi';
import {InjectRepository} from 'typeorm-typedi-extensions';
import IKeyPairConfig from '../common/config/IKeyPairConfig';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';

@Service()
export default class GenerateService {

    @InjectRepository()
    private readonly userRepository: UserRepository;
    private readonly keyPairConfig: IKeyPairConfig;

    constructor() {
        this.keyPairConfig = config.get('key_pair');
    }

    public async generateKeyPair(user: User) {
        const keyPairs = generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: this.keyPairConfig.secret,
            },
        });

        user.publicKey = keyPairs.publicKey;
        await this.userRepository.save(user);

        return {
            privKey: keyPairs.privateKey,
            pubKey: keyPairs.publicKey,
        };
    }
}
