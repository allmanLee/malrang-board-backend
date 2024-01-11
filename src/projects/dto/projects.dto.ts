import { ApiProperty, PickType } from '@nestjs/swagger';
import { Project } from '../projects.schema';

export class ReadOnlyProjectDto extends PickType(Project, [
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
