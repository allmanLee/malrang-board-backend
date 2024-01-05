import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Req,
  Body,
  UseFilters,
  // HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { HttpExceptionFilter } from '../http-exception.filter';
import { UserRequestDto } from '../dto/users.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyUserDto } from 'src/dto/users.dto';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '전체 사용자 조회' })
  findAll(): string {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 조회' })
  findOne(@Req() request: Request, @Param() params): string {
    return this.userService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: '사용자 생성 API' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserRequestDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
    type: ReadOnlyUserDto,
  })
  async create(@Body() body: UserRequestDto) {
    console.log(body);
    // throw new HttpException(
    //   {
    //     success: false,
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );

    // HttpException 에 에러메세지만 변경해서 에러를 던질 수 있도록 수정
    // throw new HttpException('에러 커스텀 익셉션 테스트', 403);

    return await this.userService.create(body);
  }

  @ApiOperation({ summary: '사용자 업데이트 API' })
  @Put(':id')
  update(@Param() params) {
    return this.userService.update(params.id);
  }

  @ApiOperation({ summary: '사용자 삭제 API' })
  @Delete(':id')
  delete(@Param() params): string {
    return this.userService.delete(params.id);
  }
}
