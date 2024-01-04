import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
