import {createCipheriv, createDecipheriv, privateDecrypt, publicEncrypt, randomBytes} from 'crypto';
import * as fs from 'fs';
import * as config from 'nconf';
import {BadRequestError} from 'routing-controllers';
import {Service} from 'typedi';
import IKeyPairConfig from '../common/config/IKeyPairConfig';
import User from '../models/User';

@Service()
export default class EncryptService {

    public async encryptFile(user: User) {
        if (!user.publicKey) {
            throw new BadRequestError('You have not generated a key pair on your account. First generate key pair.');
        }
        const file: Buffer = fs.readFileSync(`${process.env.APP_ROOT}/data/documents/sample.pdf`);
        const key: Buffer = randomBytes(16);
        const iv: Buffer = randomBytes(16);

        const [symmetricEncryptedFile, encryptedKeyByPublicKey, encryptedIvByPublicKey] = await Promise.all([
            this.encryptSymmetric(file, key, iv),
            this.encryptByPublicKey(key, user.publicKey),
            this.encryptByPublicKey(iv, user.publicKey),
        ]);

        return {
            file: symmetricEncryptedFile.toString('base64'),
            key: encryptedKeyByPublicKey.toString('base64'),
            iv: encryptedIvByPublicKey.toString('base64'),
        };
    }

    private async encryptSymmetric(buffer: Buffer, key: Buffer, iv: Buffer): Promise<Buffer> {
        const cipher = createCipheriv('aes-128-cbc', key, iv);
        const encrypted = cipher.update(buffer);

        return Buffer.concat([encrypted, cipher.final()]);
    }

    private async encryptByPublicKey(buffer: Buffer, publicKey: string): Promise<Buffer> {
        return publicEncrypt(publicKey, buffer);
    }

    private async decryptSymmetric(buffer: Buffer, key: Buffer, iv: Buffer): Promise<Buffer> {
        const decipher = createDecipheriv('aes-128-cbc', key, iv);
        const decrypted = decipher.update(buffer);

        return Buffer.concat([decrypted, decipher.final()]);
    }

    private async decryptByPrivateKey(buffer: Buffer, privateKey: string): Promise<Buffer> {
        const keyPairConfig: IKeyPairConfig = config.get('key_pair');

        return privateDecrypt(
            {
                key: privateKey,
                passphrase: keyPairConfig.secret,
            },
            buffer,
        );
    }
}
