import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, Team } from './projects.schema';
import { ProjectRequestDto, TeamRequestDto } from './dto/projects.request.dto';
import { getProjectParams } from 'src/types/params.type';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.projectModel.exists({ email });
      return !!result; // Explicitly return a boolean value
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  create(project: ProjectRequestDto) {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }

  async findAll(params: getProjectParams) {
    const query = params;

    // 프로젝트 조회
    return await this.projectModel.find(query).exec();
  }

  async findOne(id: number) {
    return await this.projectModel.findById(id).exec();
  }

  async delete(id: number) {
    return await this.projectModel.findByIdAndDelete(id).exec();
  }

  async update(id: number, project: ProjectRequestDto) {
    return await this.projectModel.findByIdAndUpdate(id, project).exec();
  }

  async findByEmail(email: string) {
    return await this.projectModel.findOne({ email }).exec();
  }

  /* ------------------------------------ 팀 ----------------------------------- */
  async createTeam(team: TeamRequestDto) {
    try {
      const createdTeam = new this.teamModel(team);
      return createdTeam.save();
    } catch (error) {
      console.log('너냐, error');
      throw new HttpException(error, 500);
    }
  }
}
