import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/users/users.schema';

export class ReadOnlyUserDto extends PickType(User, [
  'email',
  'name',
] as const) {
  @ApiProperty({
    example: 'id',
    description: '아이디',
    required: true,
  })
  id: string;
}
