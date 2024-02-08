import { Module } from '@nestjs/common';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { Board, BoardSchema, Card, CardSchema } from 'src/kanban/kanban.schema';
import { KanbanRepository } from './kanban.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [KanbanController],
  providers: [KanbanService, KanbanRepository],
  exports: [KanbanService, KanbanRepository],
})
export class KanbanModule {}
