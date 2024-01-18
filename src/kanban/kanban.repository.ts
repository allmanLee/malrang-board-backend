import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, Card } from './kanban.schema';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Board.name) private readonly boardModal: Model<Board>,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
  ) {}

  // readOnlyData (readOnlyBaord, readOnlyCard)

  async findAll() {
    const boards = await this.boardModal.find().exec();
    return boards;
  }

  async findOne(id: string) {
    const board = await this.boardModal.findById(id).exec();
    return board;
  }

  async create() {
    const createdBoard = new this.boardModal();
    return createdBoard.save();
  }

  async delete() {
    return 'This action removes a #${id} board';
  }
}
