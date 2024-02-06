import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { KanbanService } from './kanban.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadOnlyBoardDto } from './dto/kanban.dto';
import { getBoardsParams } from 'src/types/params.type';

@Controller('kanban/boards')
@UseFilters(HttpExceptionFilter)
@ApiTags('kanban')
// API 기능을 구현하는 컨트롤러
// 기능: 보드 조회, 보드 추가 및 삭제, 카드 조회, 카드 추가 및 삭제, 카드 이동, 카드 수정, 카드 상태 변경 API
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  // 보드 조회 API
  // GET /kanban/boards
  // GET /kanban/boards/:id
  @Get()
  @ApiOperation({ summary: '전체 보드 조회' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: ReadOnlyBoardDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
    type: ReadOnlyBoardDto,
  })
  async findAll(
    @Req() request: any,
    @Query() query: getBoardsParams,
  ): Promise<any> {
    return await this.kanbanService.findAll(query);
  }

  // 보드 개별 조회 API
  // GET /kanban/boards/:id
  // @Get(':id')
  // async findOne(): Promise<any> {
  //   return await this.kanbanService.findOne();
  // }

  // 보드 추가 API
  // POST /kanban/boards
  @ApiOperation({ summary: '사용자 생성 API' })
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: UserRequestDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
    // type: ReadOnlyUserDto,
  })
  @Post()
  async create(@Body() body: ReadOnlyBoardDto): Promise<any> {
    return await this.kanbanService.create(body);
  }

  // 카드 추가 API
  // POST /kanban/boards/:id/cards
  @Post(':id/card')
  async addCard(
    @Param('id') id: string,
    @Body() body: ReadOnlyBoardDto,
  ): Promise<any> {
    const baordId = id;
    return await this.kanbanService.addCard(baordId, body);
  }
}
