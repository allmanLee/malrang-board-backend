import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsString, IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.schema';

const options: SchemaOptions = {
  timestamps: true,
};

// permission: 'admin' | 'project' | 'guest'

export type Permission = 'admin' | 'project';

export interface readOnlyData {
  name: string;
  teams?: Team[];
  groupId?: string;
  projectId?: string;
  users?: User[];
  createuserId: string;
}

@Schema(options)
export class Project extends Document {
  @ApiProperty({
    example: 'name',
    description: '이름',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'groupId',
    description: '그룹 아이디',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  groupId: string;

  teams: Team[];
  createuserId: string;
  isDeleted: boolean;

  readonly readOnlyData: readOnlyData;
}

@Schema(options)
export class Team extends Document {
  @ApiProperty({
    example: 'name',
    description: '이름',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  users: User[];
  projectId: string;
  createuserId: string;
  isDeleted: boolean;

  readonly readOnlyData: readOnlyData;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export const TeamSchema = SchemaFactory.createForClass(Team);

ProjectSchema.virtual('readOnlyData').get(function (
  this: Project,
): readOnlyData {
  return {
    name: this.name,
    teams: this.teams ? this.teams : null,
    groupId: this.groupId,
    createuserId: this.createuserId,
  };
} as any);

TeamSchema.virtual('readOnlyData').get(function (this: Team): readOnlyData {
  return {
    name: this.name,
    users: this.users ? this.users : null,
    projectId: this.projectId,
    createuserId: this.createuserId,
  };
} as any);
