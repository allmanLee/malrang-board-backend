import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, Card, FilterView, readOnlyBoard } from './kanban.schema';
import { ReadOnlyBoardDto } from './dto/kanban.dto';
import type { getCardsParams } from 'src/types/params.type';
import { User } from 'src/users/users.schema';

@Injectable()
export class KanbanRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
    @InjectModel(FilterView.name)
    private readonly filterViewModel: Model<FilterView>,
  ) {}

  // readOnlyData (readOnlyBaord, readOnlyCard)

  async findAll(params: any): Promise<readOnlyBoard[]> {
    // 파라미터로 받은 teamId로 보드 리스트를 조회
    const boards = await this.boardModel.find({ teamId: params.teamId }).exec();
    // readOnlyBoard[]; 로 바꿈
    return boards.map((board) => board.readOnlyData);
  }

  async findOne(id: string) {
    const board = await this.boardModel.findById(id).exec();
    return board;
  }

  async create(payload: ReadOnlyBoardDto) {
    const createdBoard = new this.boardModel();
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
  async createCard(boardId: string, payload: any) {
    try {
      // formTemplate에 스키마를 제외한 키들이 존재하는지 확인합니다.
      const newCard = new this.cardModel(payload);

      // 사용자 이름을 찾아서 카드에 추가합니다.
      const findUser = await this.userModel.findById(payload.userId).exec();
      newCard.userName = findUser.name;
      newCard.userAvatar = findUser.avatar;

      // 동일 프로젝트ID의 카드에서 ProjectCardId중 가장 높은 숫자를 찾아서 +1을 해줍니다.
      const cards = await this.cardModel
        .find({ projectId: payload.projectId })
        .exec();
      const maxProjectCardId = cards.reduce((acc, cur) => {
        if (acc < cur.projectCardId) {
          return cur.projectCardId;
        }
        return acc;
      }, 0);
      newCard.projectCardId = maxProjectCardId + 1;
      return newCard.save();
    } catch (error) {
      throw new Error('카드 추가에 실패했습니다.');
    }
  }

  // 카드의 보드를 이동합니다.
  async moveCard(boardId: string, cardId: string, order: number) {
    try {
      const card = await this.cardModel.findById(cardId).exec();
      card.boardId = boardId;

      // 해당 보드의 카드들을 조회합니다.
      const cards = await this.cardModel.find({ boardId }).exec();

      if (cards.length === 0) {
        card.order = 1;
      } else {
        // 카드의 순서를 변경합니다.
        card.order = order;
      }

      return card.save();
    } catch (error) {
      throw new Error('카드 이동에 실패했습니다.');
    }
  }

  // 카드를 수정합니다.
  async updateCard(id: string, payload: any) {
    try {
      // 유저 이름을 찾아서 카드에 추가합니다.
      const findUser = await this.userModel.findById(payload.userId).exec();
      payload.userName = findUser.name;
      payload.userAvatar = findUser.avatar;

      console.log('payload 응?', payload);

      const result = await this.cardModel
        .findByIdAndUpdate(id, payload, { new: true })
        .exec();
      console.log('result', result);
      return result;
    } catch (error) {
      throw new Error('카드 수정에 실패했습니다.');
    }
  }

  // 필터뷰를 조회합니다.
  async getFilterViews(query: any) {
    try {
      return await this.filterViewModel.find(query).exec();
    } catch (error) {
      console.log('필터뷰 조회에 실패했습니다.', error);
      throw new Error('필터뷰 조회에 실패했습니다.');
    }
  }

  // 필터뷰를 생성합니다.
  async createFilterView(payload: any) {
    try {
      return await this.filterViewModel.create(payload);
    } catch (error) {
      console.log('필터뷰 생성에 실패했습니다.', error);
      throw new Error('필터뷰 생성에 실패했습니다.');
    }
  }

  // 필터뷰를 수정합니다.
  async updateFilterView(id: string, payload: any) {
    try {
      return await this.filterViewModel.findByIdAndUpdate(id, payload, {
        new: true,
      });
    } catch (error) {
      console.log('필터뷰 수정에 실패했습니다.', error);
      throw new Error('필터뷰 수정에 실패했습니다.');
    }
  }

  // 필터뷰를 삭제합니다.
  async deleteFilterView(id: string) {
    try {
      return await this.filterViewModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.log('필터뷰 삭제에 실패했습니다.', error);
      throw new Error('필터뷰 삭제에 실패했습니다.');
    }
  }
}
