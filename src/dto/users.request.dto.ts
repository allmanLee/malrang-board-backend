import { PickType } from '@nestjs/swagger';
import { User } from '../users/users.schema';
// import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserRequestDto extends PickType(User, [
  'email',
  'name',
  'password',
  'groupName',
] as const) {}
