import {CurrentUser, JsonController, Post} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import User from '../models/User';
import EncryptService from '../services/EncryptService';

@JsonController('')
@Service()
export default class EncryptController {

    @Inject()
    private readonly encryptService: EncryptService;

    @Post('/encrypt')
    public encrypt(@CurrentUser({required: true}) user: User) {
        return this.encryptService.encryptFile(user);
    }
}
