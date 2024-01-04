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
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { HttpExceptionFilter } from '../http-exception.filter';
import { UserRequestDto } from 'src/dto/users.request.dto';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(): string {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param() params): string {
    return this.userService.findOne(params.id);
  }

  @Post()
  create(@Body() body: UserRequestDto) {
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

    return this.userService.create();
  }

  @Put(':id')
  update(@Param() params) {
    return this.userService.update(params.id);
  }

  @Delete(':id')
  delete(@Param() params): string {
    return this.userService.delete(params.id);
  }
}
