import { IsEmail, IsString } from 'class-validator';
import { UserValidationMessages } from './user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: UserValidationMessages.password.invalidFormat })
  public password: string;
}
