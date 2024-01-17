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

  /**  프로젝트에 팀 추가
   * @param projectId 프로젝트 아이디
   * @param team 팀 (RequestDto가 아닌 Team 스키마)
   * @returns
   **/
  async addTeam(projectId: string, team: Team) {
    try {
      const project = await this.projectModel.findById(projectId).exec();

      if (!project)
        throw new HttpException('프로젝트가 존재하지 않습니다.', 404);

      if (!project?.teams) project.teams = [];
      if (project.teams?.includes(team))
        throw new HttpException('이미 존재하는 팀입니다.', 409);

      project.teams.push(team);
      return await project.save();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 프로젝트 개별 조회
  async findOne(id: string) {
    try {
      return await this.projectModel.findById(id).exec();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async delete(id: string) {
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
