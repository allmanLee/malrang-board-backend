import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, Card, readOnlyBoard } from './kanban.schema';
import { ReadOnlyBoardDto } from './dto/kanban.dto';
import type { getCardsParams } from 'src/types/params.type';

@Injectable()
export class KanbanRepository {
  constructor(
    @InjectModel(Board.name) private readonly boardModal: Model<Board>,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
  ) {}

  // readOnlyData (readOnlyBaord, readOnlyCard)

  async findAll(params: any): Promise<readOnlyBoard[]> {
    // 파라미터로 받은 teamId로 보드 리스트를 조회
    const boards = await this.boardModal.find({ teamId: params.teamId }).exec();
    // readOnlyBoard[]; 로 바꿈
    return boards.map((board) => board.readOnlyData);
  }

  async findOne(id: string) {
    const board = await this.boardModal.findById(id).exec();
    return board;
  }

  async create(payload: ReadOnlyBoardDto) {
    const createdBoard = new this.boardModal();
    createdBoard.title = payload.title;
    createdBoard.teamId = payload.teamId;
    return createdBoard.save();
  }

  async findAllCards(query: getCardsParams) {
    const cards = await this.cardModel.find(query).exec();
    return cards;
  }

  // 카드를 삭제합니다.
  async deleteCard(id: string) {
    try {
      return await this.cardModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error('카드 삭제에 실패했습니다.');
    }
  }

  // 카드를 추가합니다.
  async addCard(boardId: string, payload: any) {
    try {
      // const board = await this.boardModal.findById(boardId).exec();
      const newCard = new this.cardModel(payload);
      return newCard.save();
    } catch (error) {
      throw new Error('카드 추가에 실패했습니다.');
    }
  }

  // 카드의 보드를 이동합니다.
  async moveCard(boardId: string, cardId: string) {
    try {
      const card = await this.cardModel.findById(cardId).exec();
      card.boardId = boardId;
      return card.save();
    } catch (error) {
      throw new Error('카드 이동에 실패했습니다.');
    }
  }
}
