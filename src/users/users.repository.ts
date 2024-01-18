import { HttpException, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, User } from './users.schema';
import { UserRequestDto } from 'src/dto/users.request.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userModel.exists({ email });
      return !!result; // Explicitly return a boolean value
    } catch (error) {
      Logger.error('유저 존재 여부 체크 에러', error);
      throw new HttpException('서버 에러', 500);
    }
  }

  /* ---------------------------------- 유저 생성 --------------------------------- */
  async create(user: {
    email: string;
    name: string;
    password: string;
    groupName: string;
    groupId: string;
  }) {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      Logger.error('유저 생성 에러', error);
      throw new HttpException('서버 에러', 500);
    }
  }

  async findAll(params) {
    try {
      return await this.userModel.find(params).exec();
    } catch (error) {
      Logger.error('유저 전체 조회 에러', error);
      throw new HttpException('서버 에러', 500);
    }
  }

  async findOne(id: number) {
    return await this.userModel.findById(id).exec();
  }

  async delete(id: number) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async update(id: number, user: UserRequestDto) {
    return await this.userModel.findByIdAndUpdate(id, user).exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  /* ---------------------------------- 그룹 생성 --------------------------------- */
  async existsByGroup(name: string): Promise<boolean> {
    console.log('그룹 존재 여부 체크');
    try {
      const result = await this.groupModel.exists({ name });
      return !!result; // Explicitly return a boolean value
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  async findGroup(name: string) {
    try {
      const result = await this.groupModel.findOne({ name }).exec();
      return result;
    } catch (error) {
      console.log('그룹 조회 에러', error);
      throw new HttpException('서버 에러', 500);
    }
  }

  async findGroupId(name: string): Promise<string> {
    try {
      const result = await this.groupModel.findOne({ name }).exec();
      return result?._id;
    } catch (error) {
      console.log('그룹 조회 에러2', error);
      throw new HttpException('서버 에러', 500);
    }
  }

  async updateGroup(name: string, email: string) {
    console.log('그룹에 유저 추가');
    try {
      const group = await this.findGroup(name);
      group.userIds.push(email);
      await group.save();
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  async createGroup(name: string) {
    console.log('그룹 생성');
    try {
      const createdGroup = new this.groupModel({
        name,
        permission: {
          read: true,
          write: false,
          remove: false,
        },
      });

      const result = await createdGroup.save();
      return result;
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }
}
