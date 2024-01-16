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
  findOne(id: number) {
    return `This action returns a #${id} project`;
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
      console.log(project);
      return project;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // 프로젝트 업데이트
  update(id: number) {
    return `This action updates a #${id} project`;
  }
  // 프로젝트 삭제
  delete(id: number) {
    return `This action removes a #${id} project`;
  }

  /* --------------------------------- 팀 CRUD --------------------------------- */

  // 팀 생성
  async createTeam(body: TeamRequestDto) {
    // 로그
    this.logger.log('팀 생성', body);
    try {
      const { name, createUserId, projectId } = body;
      const Team = await this.projectsRepository.createTeam({
        name,
        projectId,
        createUserId,
      });
      console.log(Team);
      return Team;
    } catch (error) {
      console.log('너구나 Service, error', error);
      throw new HttpException(error, 500);
    }
  }
}
