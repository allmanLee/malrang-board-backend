import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GroupSchema, User, Group, UserSchema } from './users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users.repository';
import { ApiTags } from '@nestjs/swagger';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
@ApiTags('users')
export class UsersModule {}
