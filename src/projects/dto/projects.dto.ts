import { ApiProperty, PickType } from '@nestjs/swagger';
import { Project } from '../projects.schema';

export class ReadOnlyProjectDto extends PickType(Project, [
  'name',
  'createuserId',
] as const) {
  @ApiProperty({
    example: 'id',
    description: '프로젝트 아이디',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: 'teams',
    description: '프로젝트 팀',
    required: true,
  })
  teams: string[];

  @ApiProperty({
    example: 'users',
    description: '프로젝트 유저',
    required: true,
  })
  users: string[];

  @ApiProperty({
    example: 'groupId',
    description: '프로젝트가 속한 그룹',
    required: true,
  })
  groupId: string;

  @ApiProperty({
    example: 'isDeleted',
    description: '프로젝트 삭제 여부',
    required: true,
  })
  isDeleted: boolean;
}

export class ReadOnlyTeamDto extends PickType(Project, [
  'name',
  'createuserId',
] as const) {
  @ApiProperty({
    example: 'id',
    description: '팀 아이디',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: 'users',
    description: '팀 유저',
    required: true,
  })
  users: string[];

  @ApiProperty({
    example: 'projectId',
    description: '팀이 속한 프로젝트',
    required: true,
  })
  projectId: string;

  @ApiProperty({
    example: 'isDeleted',
    description: '팀 삭제 여부',
    required: true,
  })
  isDeleted: boolean;
}
