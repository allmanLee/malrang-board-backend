import {
  HttpException,
  Injectable,
  Logger,
  // UnauthorizedException,
} from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Project } from './projects.schema';
import { ProjectRequestDto } from './dto/projects.request.dto';
import { ProjectsRepository } from './projects.repository';
import { getProjectParams } from 'src/types/params.type';

@Injectable()
export class ProjectsService {
  // constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  private readonly logger = new Logger('PROJECT API');

  // 프로젝트 전체 조회
  findAll(params: getProjectParams) {
    const { groupId, projectId, isDeleted } = params;

    // 기본적으로  isDeleted가 false인 프로젝트만 조회
    const query = {
      groupId,
      projectId,
      isDeleted: false,
    };

    // isDeleted가 true일 경우 삭제된 프로젝트도 조회
    if (isDeleted) {
      delete query.isDeleted;
    }

    // 프로젝트 조회
    return this.projectsRepository.findAll(query);
  }
  // 프로젝트 개별 조회
  findOne(id: number) {
    return `This action returns a #${id} project`;
  }
  // 프로젝트 생성
  async create(body: ProjectRequestDto) {
    try {
      const { name, createuserId } = body;
      const project = await this.projectsRepository.create({
        name,
        createuserId,
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
}
