import { Module } from '@nestjs/common';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { Board, BoardSchema, Card, CardSchema } from 'src/kanban/kanban.schema';
import { KanbanRepository } from './kanban.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';
import { ProjectsRepository } from 'src/projects/projects.repository';
import {
  Project,
  ProjectSchema,
  Team,
  TeamSchema,
} from 'src/projects/projects.schema';
// import { Team, TeamSchema } from 'src/projects/projects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [KanbanController],
  providers: [KanbanService, KanbanRepository, ProjectsRepository],
  exports: [KanbanService, KanbanRepository],
})
export class KanbanModule {}
