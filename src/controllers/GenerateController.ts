import {CurrentUser, JsonController, Post} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import User from '../models/User';
import GenerateService from '../services/GenerateService';

@JsonController('')
@Service()
export default class GenerateController {

    @Inject()
    private readonly generateService: GenerateService;

    @Post('/generate-key-pair')
    public generateKyePair(@CurrentUser({required: true}) user: User) {
        return this.generateService.generateKeyPair(user);
    }
}
