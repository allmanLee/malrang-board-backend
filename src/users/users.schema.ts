import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

// permission: 'admin' | 'user' | 'guest'

export type Permission = 'admin' | 'user';

export interface readOnlyData {
  id: string;
  email: string;
  name: string;
  groupName: string;
  permission: Permission;
}

@Schema(options)
export class User extends Document {
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
    example: 'email',
    description: '이메일',
    required: true,
  })
  @Prop({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: '비밀번호',
    required: true,
  })
  @Prop({})
  password: string;

  @ApiProperty({
    example: 'permission',
    description: '권한',
    required: true,
    enum: ['admin', 'user'],
  })
  @Prop({})
  permission: Permission;

  // 그룹명
  @ApiProperty({
    example: 'groupName',
    description: '그룹명',
    required: true,
  })
  @Prop({})
  groupName: string;

  readonly readOnlyData: readOnlyData;
}

@Schema(options)
export class Group extends Document {
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
    example: 'domain',
    description: '도메인',
    required: true,
  })
  @Prop({})
  @IsNotEmpty()
  @IsString()
  domain: string;

  // 유저들의 id를 저장
  @Prop({})
  user_ids: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const GroupSchema = SchemaFactory.createForClass(Group);

UserSchema.virtual('readOnlyData').get(function (this: User): readOnlyData {
  const { id, email, name, groupName, permission } = this;
  return { id, email, name, groupName, permission };
} as any);
export const UserSwagger = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'name',
      description: '이름',
    },
    email: {
      type: 'string',
      example: 'email',
      description: '이메일',
    },
    password: {
      type: 'string',
      example: 'password',
      description: '비밀번호',
    },
    permission: {
      type: 'string',
      example: 'permission',
      description: '권한',
      enum: ['admin', 'user'],
    },
    groupName: {
      type: 'string',
      example: 'groupName',
      description: '그룹명',
    },
    readOnlyData: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID',
        },
        email: {
          type: 'string',
          description: '이메일',
        },
        name: {
          type: 'string',
          description: '이름',
        },
        groupName: {
          type: 'string',
          description: '그룹명',
        },
        permission: {
          type: 'string',
          description: '권한',
          enum: ['admin', 'user'],
        },
      },
    },
  },
};

export const GroupSwagger = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'name',
      description: '이름',
    },
    domain: {
      type: 'string',
      example: 'domain',
      description: '도메인',
    },
    user_ids: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: '유저들의 ID',
    },
  },
};
