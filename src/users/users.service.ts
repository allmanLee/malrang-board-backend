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
import { Permission, User } from './users.schema';

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
    const { email, name, password, groupName } = body;
    const isUserExit = await this.usersRepository.existsByEmail(email);
    let groupId = await this.usersRepository.findGroupId(groupName);

    // 여긴가?
    Logger.log('유저 생성 서비스 진입');

    if (isUserExit) {
      // 403 에러를 던지는 자동화된 클래스
      // throw new UnauthorizedException('이미 존재하는 유저입니다.');
      this.logger.error('이미 존재하는 유저입니다.');
      throw new HttpException('이미 존재하는 유저입니다.', 409);
    }

    console.log('여긴가');

    if (!groupId) {
      // 만약 DB에 없던 그룹명이라면 그룹에 추가하고 그룹 ID를 리턴
      console.log('여긴가');
      groupId = await this.usersRepository
        .createGroup(groupName)
        .then((res) => {
          this.logger.log('그룹 생성 완료', res);
          return res._id;
        })
        .catch((err) => {
          this.logger.error('그룹 생성 실패', err);
          throw new HttpException('그룹 생성 실패', 500);
        });
    }

    // 비밀번호 암호화
    const hahedPassword = await bcrypt.hash(password, 10);

    // 그룹 userIds에 추가
    await this.usersRepository.updateGroup(groupName, email).catch((err) => {
      this.logger.error('그룹에 유저 추가 실패', err);
      throw new HttpException('그룹에 유저 추가 실패', 500);
    });

    this.logger.log('그룹 IDX 조회:', groupId);

    const user = await this.usersRepository.create({
      email,
      name,
      password: hahedPassword,
      groupName,
      groupId,
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

  // 사용자 퍼미션 조회
  async findPermissions(userId: number): Promise<Permission> {
    const user = await this.usersRepository.findOne(userId);
    return user.permission;
  }

  // 사용자 퍼미션 업데이트
  async updatePermissions(
    userId: number,
    permission: Permission,
  ): Promise<User['readOnlyData']> {
    const user = await this.usersRepository.findOne(userId);
    user.permission = permission;
    await user.save();
    return user.readOnlyData;
  }

  // 로그인
  async login(email: string, password: string): Promise<User['readOnlyData']> {
    Logger.log('로그인 서비스 진입');
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.logger.error('이메일이 존재하지 않습니다.');
      throw new HttpException('이메일이 존재하지 않습니다.', 409);
    }

    const isPasswordValidated = await bcrypt.compare(password, user.password);

    if (!isPasswordValidated) {
      this.logger.error('비밀번호가 일치하지 않습니다.');
      throw new HttpException('비밀번호가 일치하지 않습니다.', 409);
    }

    this.logger.log('로그인 성공');
    return user.readOnlyData;
  }
}
