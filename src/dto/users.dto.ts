import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.schema';

export class ReadOnlyUserDto {
  @ApiProperty({
    example: 'name',
    description: '이름',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'email',
    description: '이메일',
    required: true,
  })
  email: string;
}
