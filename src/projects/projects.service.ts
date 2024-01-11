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
import * as bcrypt from 'bcrypt';
import { ProjectsRepository } from './projects.repository';
import { Permission, Project } from './projects.schema';

@Injectable()
export class ProjectsService {
  // constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  private readonly logger = new Logger('PROJECT API');

  // 프로젝트 전체 조회
  findAll() {
    return 'This action returns all projects';
  }
  // 프로젝트 개별 조회
  findOne(id: number) {
    return `This action returns a #${id} project`;
  }
  // 프로젝트 생성
  async create(body: ProjectRequestDto) {
    const { email, name, password } = body;
    const isProjectExit = await this.projectsRepository.existsByEmail(email);

    if (isProjectExit) {
      // 403 에러를 던지는 자동화된 클래스
      // throw new UnauthorizedException('이미 존재하는 프로젝트입니다.');
      this.logger.error('이미 존재하는 프로젝트입니다.');
      throw new HttpException('이미 존재하는 프로젝트입니다.', 409);
    }

    const hahedPassword = await bcrypt.hash(password, 10);

    const project = await this.projectsRepository.create({
      email,
      name,
      password: hahedPassword,
    });

    this.logger.log('프로젝트 생성 완료', project);
    return project.readOnlyData;
  }
  // 프로젝트 업데이트
  update(id: number) {
    return `This action updates a #${id} project`;
  }
  // 프로젝트 삭제
  delete(id: number) {
    return `This action removes a #${id} project`;
  }

  // 사용자 퍼미션 조회
  async findPermissions(projectId: number): Promise<Permission> {
    const project = await this.projectsRepository.findOne(projectId);
    return project.permission;
  }

  // 사용자 퍼미션 업데이트
  async updatePermissions(
    projectId: number,
    permission: Permission,
  ): Promise<Project['readOnlyData']> {
    const project = await this.projectsRepository.findOne(projectId);
    project.permission = permission;
    await project.save();
    return project.readOnlyData;
  }

  // 로그인
  async login(
    email: string,
    password: string,
  ): Promise<Project['readOnlyData']> {
    Logger.log('로그인 서비스 진입');
    const project = await this.projectsRepository.findByEmail(email);

    if (!project) {
      this.logger.error('이메일이 존재하지 않습니다.');
      throw new HttpException('이메일이 존재하지 않습니다.', 409);
    }

    const isPasswordValidated = await bcrypt.compare(
      password,
      project.password,
    );

    if (!isPasswordValidated) {
      this.logger.error('비밀번호가 일치하지 않습니다.');
      throw new HttpException('비밀번호가 일치하지 않습니다.', 409);
    }

    this.logger.log('로그인 성공');
    return project.readOnlyData;
  }
}
