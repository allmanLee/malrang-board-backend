import { ApiProperty, PickType } from '@nestjs/swagger';
import { Board } from '../kanban.schema';

export class ReadOnlyBoardDto extends PickType(Board, [
  'title',
  'teamId',
] as const) {
  @ApiProperty({
    example: 'title',
    description: 'Title',
    required: true,
  })
  title: string;

  @ApiProperty({
    example: 'teamId',
    description: '프로젝트 팀',
    required: true,
  })
  teamId: string;
}
