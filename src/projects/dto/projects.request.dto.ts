import { PickType } from '@nestjs/swagger';
import { Project, Team } from '../projects.schema';
// import { IsNotEmpty, IsEmail } from 'class-validator';

export class ProjectRequestDto extends PickType(Project, [
  'name',
  'groupId',
  'createUserId',
] as const) {}

export class TeamRequestDto extends PickType(Team, [
  'name',
  'projectId',
  'createUserId',
  'formTemplate',
] as const) {}
