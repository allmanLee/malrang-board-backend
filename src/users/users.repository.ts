import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { UserRequestDto } from 'src/dto/users.request.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userModel.exists({ email });
      return !!result; // Explicitly return a boolean value
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  create(user: UserRequestDto) {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll() {
    return await this.userModel.find().exec();
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
}
