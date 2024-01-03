import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
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
    return 'This action adds a new user';
  }
  // 유저 업데이트
  update() {
    return 'This action updates a #${id} user';
  }
  // 유저 삭제
  delete() {
    return 'This action removes a #${id} user';
  }
}
