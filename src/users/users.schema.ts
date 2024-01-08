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

  @Prop({})
  permission: Permission;

  readonly readOnlyData: readOnlyData;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyData').get(function (this: User): readOnlyData {
  const { id, email, name, permission } = this;
  return { id, email, name, permission };
} as any);
