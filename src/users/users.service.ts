import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
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
  create() {
    this.logger.log('유저 생성 API 호출');

    return 'This action adds a new user';
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
