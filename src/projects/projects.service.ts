import {
  HttpException,
  Injectable,
  Logger,
  // UnauthorizedException,
} from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Project } from './projects.schema';
import { ProjectRequestDto, TeamRequestDto } from './dto/projects.request.dto';
import { ProjectsRepository } from './projects.repository';
import { getProjectParams } from 'src/types/params.type';
import { Project } from './projects.schema';

@Injectable()
export class ProjectsService {
  // constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  private readonly logger = new Logger('PROJECT API');

  // 프로젝트 전체 조회
  async findAll(params: getProjectParams) {
    try {
      const projects = await this.projectsRepository.findAll(params);
      return projects;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  // 프로젝트 개별 조회
  async findOne(id: string) {
    try {
      const project = await this.projectsRepository.findOne(id);
      return project;
    } catch (error) {
      throw new HttpException(error, 500);
    } finally {
      this.logger.log('프로젝트 조회');
    }
  }
  // 프로젝트 생성
  async create(body: ProjectRequestDto) {
    try {
      const { name, createUserId, groupId } = body;
      const project = await this.projectsRepository.create({
        name,
        groupId,
        createUserId,
      });

      return project;
    } catch (error) {
      console.log('프로젝트 생성 서비스단 오류');
      throw new HttpException(error, 500);
    }
  }

  // 프로젝트 업데이트
  update(id: number) {
    return `This action updates a #${id} project`;
  }
  // 프로젝트 삭제
  async delete(id: string) {
    try {
      const project = await this.projectsRepository.delete(id);
      return project;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  /* --------------------------------- 팀 CRUD --------------------------------- */

  // 팀 생성
  async createTeam(body: TeamRequestDto) {
    try {
      const { name, createUserId, projectId } = body;
      const Team = await this.projectsRepository.createTeam({
        name,
        projectId,
        createUserId,
      });

      this.projectsRepository.addTeam(projectId, Team);
      return Team;
    } catch (error) {
      console.log('팀 생성 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }

  // 팀 삭제 및 프로젝트에서 팀 삭제
  async deleteTeam(projectId: string, teamId: string): Promise<Project> {
    try {
      await this.projectsRepository.deleteTeam(teamId);
      const project = this.projectsRepository.deleteTeamInProject(
        projectId,
        teamId,
      );
      return project;
    } catch (error) {
      console.log('팀 삭제 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }

  // 팀에 멤버 추가하고 프로젝트에서도 팀을 조회하여 추가합니다.
  async addMember(projectId: string, teamId: string, userId: string) {
    try {
      const member = await this.projectsRepository.addMember(teamId, userId);

      // 프로젝트 모델의 팀을 찾아 팀에 맴버를 추가합니다.
      await this.projectsRepository.addMemberInProject(
        projectId,
        teamId,
        userId,
      );

      return member;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async deleteMember(projectId: string, teamId: string, userId: string) {
    try {
      const member = await this.projectsRepository.deleteMember(teamId, userId);
      await this.projectsRepository.deleteMemberInProject(
        projectId,
        teamId,
        userId,
      );
      return member;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
