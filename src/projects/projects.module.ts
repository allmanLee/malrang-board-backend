import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema, Team, TeamSchema } from './projects.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsRepository } from './projects.repository';
import { User, UserSchema } from 'src/users/users.schema';
import { KanbanRepository } from 'src/kanban/kanban.repository';
import { Board, BoardSchema } from 'src/kanban/kanban.schema';
import { Card, CardSchema } from 'src/kanban/kanban.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository, KanbanRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
