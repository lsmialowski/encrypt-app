import {Body, JsonController, Post} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import AuthDto from '../dtos/AuthDto';
import AuthSignInDto from '../dtos/AuthSignInDto';
import AuthService from '../services/AuthService';

@JsonController('')
@Service()
export default class AuthController {

    @Inject()
    private readonly authService: AuthService;

    @Post('/register')
    public register(@Body() data: AuthDto) {
        return this.authService.register(data);
    }

    @Post('/sign-in')
    public async signIn(@Body() credentials: AuthSignInDto) {
        return this.authService.signIn(credentials);
    }
}
