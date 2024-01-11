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
import { ProjectsService } from './projects.service';
import { Request } from 'express';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ProjectRequestDto } from './dto/projects.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyProjectDto } from './dto/projects.dto';

import { Permission, Project } from './projects.schema';

@Controller('projects')
@UseFilters(HttpExceptionFilter)
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: '전체 사용자 조회' })
  findAll(): string {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 조회' })
  findOne(@Req() request: Request, @Param() params): string {
    return this.projectService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: '사용자 생성 API' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: ProjectRequestDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
    type: ReadOnlyProjectDto,
  })
  async create(@Body() body: ProjectRequestDto) {
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

    return await this.projectService.create(body);
  }

  @ApiOperation({ summary: '사용자 업데이트 API' })
  @Put(':id')
  update(@Param() params) {
    return this.projectService.update(params.id);
  }

  @ApiOperation({ summary: '사용자 삭제 API' })
  @Delete(':id')
  delete(@Param() params): string {
    return this.projectService.delete(params.id);
  }

  // 사용자 퍼미션 조회 API
  @Get(':id/permissions')
  async findPermissions(@Param() params): Promise<Permission> {
    return await this.projectService.findPermissions(params.id);
  }

  // 사용자 퍼미션 변경 API
  @Put(':id/permissions')
  async updatePermissions(@Param() params): Promise<Project['readOnlyData']> {
    return await this.projectService.updatePermissions(params.id, 'admin');
  }

  // 로그인 API
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<Project['readOnlyData']> {
    return await this.projectService.login(email, password);
  }
}
