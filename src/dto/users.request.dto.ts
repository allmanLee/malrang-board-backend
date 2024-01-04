import { IsNotEmpty, IsEmail } from 'class-validator';
import { User } from 'src/users/users.schema';

export class UserRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  password: string;
}
