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
import { ProjectRequestDto, TeamRequestDto } from './dto/projects.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyProjectDto } from './dto/projects.dto';

import { Project } from './projects.schema';
import { getProjectParams } from 'src/types/params.type';
import { readOnlyData } from 'src/users/users.schema';

@Controller('projects')
@UseFilters(HttpExceptionFilter)
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: '전체 프로젝트 조회' })
  async findAll(
    @Req() request: Request,
    @Param() params: getProjectParams,
  ): Promise<Project[]> {
    return await this.projectService.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '프로젝트 조회' })
  findOne(@Req() request: Request, @Param() params): Promise<Project> {
    return this.projectService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: '프로젝트 생성 API' })
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

  @ApiOperation({ summary: '프로젝트 업데이트 API' })
  @Put(':id')
  update(@Param() params) {
    return this.projectService.update(params.id);
  }

  @ApiOperation({ summary: '프로젝트 삭제 API' })
  @Delete(':id')
  async delete(@Param() params) {
    return await this.projectService.delete(params.id);
  }

  /* ------------------------------- 팀 CRUD API ------------------------------- */
  @ApiOperation({ summary: '팀 생성 API' })
  @Post('/teams')
  async createTeam(@Body() body: TeamRequestDto) {
    return await this.projectService.createTeam(body);
  }

  // @ApiOperation({ summary: '팀 조회 API' })
  // @Get('/teams/:id')
  // async findTeam(@Param() params) {
  //   return await this.projectService.findTeam(params.id);
  // }

  @ApiOperation({ summary: '팀에 맴버추가 API' })
  @Post('/:projectId/teams/:teamId/members/:userId')
  async addMember(@Param() params, @Body() body): Promise<readOnlyData> {
    const { projectId, teamId, userId } = params;
    console.log('TODO body', body);
    return await this.projectService.addMember(projectId, teamId, userId);
  }

  @ApiOperation({ summary: '프로젝트에서 팀 삭제 API' })
  @Delete('/:projectId/teams/:teamId')
  async deleteTeam(@Param() params): Promise<Project> {
    const { projectId, teamId } = params;
    return await this.projectService.deleteTeam(projectId, teamId);
  }

  @ApiOperation({ summary: '팀에서 유저를 삭제 API' })
  @Delete('/:projectId/teams/:teamId/members/:userId')
  async deleteMember(@Param() params) {
    const { projectId, teamId, userId } = params;
    return await this.projectService.deleteMember(projectId, teamId, userId);
  }
}
