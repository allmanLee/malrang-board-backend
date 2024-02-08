import { Injectable } from '@nestjs/common';
import { KanbanRepository } from './kanban.repository';
import { readOnlyBoard } from './kanban.schema';
import { getCardsParams } from 'src/types/params.type';

@Injectable()
export class KanbanService {
  constructor(private readonly kanbanRepository: KanbanRepository) {}

  /** controller */
  /**
 * 
  // 보드 조회 API
  // GET /kanban/boards
  // GET /kanban/boards/:id
  @Get()
  async findAll(): Promise<any> {
    return await this.kanbanService.findAll();
  }
  **/
  async findAll(params: any): Promise<readOnlyBoard[]> {
    return await this.kanbanRepository.findAll(params);
  }

  // 보드 개별 조회 API
  // GET /kanban/boards/:id
  // @Get(':id')
  // async findOne(): Promise<any> {
  //   return await this.kanbanService.findOne();
  // }

  // 보드 추가 API
  // POST /kanban/boards
  async create(payload): Promise<any> {
    return await this.kanbanRepository.create(payload);
  }

  // 카드 조회 API
  // GET /kanban/cards
  async findAllCards(query: getCardsParams): Promise<any> {
    return await this.kanbanRepository.findAllCards(query);
  }

  // 카드 삭제 API
  // DELETE /kanban/cards/:id
  async deleteCard(id: string): Promise<any> {
    return await this.kanbanRepository.deleteCard(id);
  }

  // 카드 추가 API
  // POST /kanban/boards/:id/cards
  async createCard(boardId: string, payload): Promise<any> {
    return await this.kanbanRepository.createCard(boardId, payload);
  }

  // 카드 이동 API
  // PATCH /kanban/boards/:id/cards/:cardId
  async moveCard(boardId: string, cardId: string): Promise<any> {
    return await this.kanbanRepository.moveCard(boardId, cardId);
  }
}
