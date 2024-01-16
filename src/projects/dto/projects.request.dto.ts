import { PickType } from '@nestjs/swagger';
import { Project } from '../projects.schema';
// import { IsNotEmpty, IsEmail } from 'class-validator';

export class ProjectRequestDto extends PickType(Project, [
  'name',
  'groupId',
  'createuserId',
] as const) {}
