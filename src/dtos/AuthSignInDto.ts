import { IsEmail, IsString, Length} from 'class-validator';

export default class AuthSignInDto {

  @IsEmail()
  @Length(5, 255)
  public email: string;

  @IsString()
  @Length(1, 50)
  public password: string;

}
