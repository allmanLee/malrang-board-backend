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
  groupId: string;
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

  // 그룹 아이디
  @ApiProperty({
    example: 'groupId',
    description: '그룹 아이디',
    required: true,
  })
  @Prop({})
  groupId: string;

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
  userIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const GroupSchema = SchemaFactory.createForClass(Group);

UserSchema.virtual('readOnlyData').get(function (this: User): readOnlyData {
  const { id, email, groupId, name, groupName, permission } = this;
  return { id, email, groupId, name, groupName, permission };
} as any);
