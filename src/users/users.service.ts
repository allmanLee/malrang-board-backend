import {
  HttpException,
  Injectable,
  Logger,
  // UnauthorizedException,
} from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from './users.schema';
import { UserRequestDto } from '../dto/users.request.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  // constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  constructor(private readonly usersRepository: UsersRepository) {}

  private readonly logger = new Logger('USER API');

  // 유저 전체 조회
  findAll() {
    return 'This action returns all users';
  }
  // 유저 개별 조회
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  // 유저 생성
  async create(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExit = await this.usersRepository.existsByEmail(email);

    if (isUserExit) {
      // 403 에러를 던지는 자동화된 클래스
      // throw new UnauthorizedException('이미 존재하는 유저입니다.');
      this.logger.error('이미 존재하는 유저입니다.');
      throw new HttpException('이미 존재하는 유저입니다.', 409);
    }

    const hahedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      email,
      name,
      password: hahedPassword,
    });

    this.logger.log('유저 생성 완료', user);
    return user.readOnlyData;
  }
  // 유저 업데이트
  update(id: number) {
    return `This action updates a #${id} user`;
  }
  // 유저 삭제
  delete(id: number) {
    return `This action removes a #${id} user`;
  }
}
