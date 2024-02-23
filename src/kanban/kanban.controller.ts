import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { KanbanService } from './kanban.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadOnlyBoardDto } from './dto/kanban.dto';
import { getBoardsParams, getCardsParams } from 'src/types/params.type';

@Controller('kanban')
@UseFilters(HttpExceptionFilter)
@ApiTags('kanban')
// API 기능을 구현하는 컨트롤러
// 기능: 보드 조회, 보드 추가 및 삭제, 카드 조회, 카드 추가 및 삭제, 카드 이동, 카드 수정, 카드 상태 변경 API
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  // 보드 조회 API
  // GET /kanban/boards
  // GET /kanban/boards/:id
  @Get('/boards')
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
  @ApiOperation({ summary: '보드 생성 API' })
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
  @Post('/boards')
  async create(@Body() body: ReadOnlyBoardDto): Promise<any> {
    return await this.kanbanService.create(body);
  }

  // 카드 조회 API
  // GET /kanban/cards
  @Get('/cards')
  @ApiOperation({ summary: '전체 카드 조회' })
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: UserRequestDto,
  })
  async findAllCards(@Query() query: getCardsParams): Promise<any> {
    return await this.kanbanService.findAllCards(query);
  }

  // 카드 삭제 API
  // DELETE /kanban/cards/:id
  @Delete('/cards/:id')
  async deleteCard(@Param('id') id: string): Promise<any> {
    return await this.kanbanService.deleteCard(id);
  }

  // 카드 추가 API
  // POST /kanban/boards/:id/cards
  @Post('/boards/:id/card')
  async createCard(@Param('id') id: string, @Body() body: any): Promise<any> {
    try {
      const baordId = id;
      console.log(body);
      return await this.kanbanService.createCard(baordId, body);
    } catch (error) {
      console.log('카드 추가에 실패했습니다.');
      throw new HttpException(error, 500);
    }
  }

  // 카드 이동 API
  // PATCH /kanban/boards/:id/cards
  @Patch('/boards/:boardId/card/:cardId')
  async moveCard(
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Body() body: { order: number },
  ): Promise<any> {
    return await this.kanbanService.moveCard(boardId, cardId, body.order);
  }

  // 정보 컬럼 조회 API
  // GET /kanban/infoColumns
  // @Get('/infoColumns')
  // async getInfoColumns(@Query() query: any): Promise<any> {
  //   return await this.kanbanService.getInfoColumns(query);
  // }
}
