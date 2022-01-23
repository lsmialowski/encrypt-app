import {IsEmail, IsString, Length} from 'class-validator';

export default class AuthDto {

  @IsEmail()
  @Length(5, 255)
  public email: string;

  @IsString()
  @Length(5, 50)
  public password: string;
}
