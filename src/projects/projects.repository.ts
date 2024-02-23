import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, Team } from './projects.schema';
import { ProjectRequestDto, TeamRequestDto } from './dto/projects.request.dto';
import { getProjectParams } from 'src/types/params.type';
import { User } from 'src/users/users.schema';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
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
  // 팀아이디는 ObjectId로 변환하여 조회합니다.
  async findTeamById(teamId: string) {
    return await this.teamModel.findById(teamId).exec();
  }

  async createTeam(team: TeamRequestDto) {
    try {
      console.log('팀 생성', team);
      const createdTeam = new this.teamModel(team);
      return createdTeam.save();
    } catch (error) {
      console.log('[DB] 팀 생성 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }

  async deleteTeam(teamId: string) {
    try {
      return await this.teamModel.findByIdAndDelete(teamId).exec();
    } catch (error) {
      console.log('[DB] 팀 삭제 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }

  async deleteTeamInProject(projectId: string, teamId: string): Promise<any> {
    try {
      const project = await this.projectModel.findById(projectId).exec();
      if (!project)
        throw new HttpException('프로젝트가 존재하지 않습니다.', 404);
      project.teams =
        project.teams.filter((team) => team._id.toString() === teamId) || [];
      await project.save();

      return project;
    } catch (error) {
      console.log('[DB] 프로젝트에서 팀 삭제 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }

  /** 팀의 조회한 맴버를 추가합니다.
   * @param teamId 팀 아이디
   * @param userId 유저 아이디
   * @return member 추가된 팀
   **/
  async addMember(teamId: string, userId: string) {
    try {
      const team = await this.teamModel.findById(teamId).exec(); // 65a777dad9b53051af2d2383
      const _user = await this.userModel.findById(userId).exec();
      if (!team) throw new HttpException('팀이 존재하지 않습니다.', 404);
      if (!team.members) team.members = []; // members는 User 배열입니다.
      const isUserExit = team.members.find(
        (member) => member.id.toString() === userId,
      );

      if (isUserExit) throw new HttpException('이미 존재하는 멤버입니다.', 409);

      team.members.push(_user.readOnlyData);
      await team.save();

      return _user.readOnlyData;
    } catch (error) {
      console.log('[DB] 팀에 멤버 추가 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }

  /** 프로젝트에서 팀의 조회한 맴버를 추가합니다.
   * @param projectId 프로젝트 아이디
   * @param teamId 팀 아이디
   * @param userId 유저 아이디
   * @return member 추가된 프로젝트
   **/
  async addMemberInProject(projectId: string, teamId: string, userId: string) {
    try {
      const project = await this.projectModel.findById(projectId).exec();
      const _user = await this.userModel.findById(userId).exec();

      if (!project)
        throw new HttpException('프로젝트가 존재하지 않습니다.', 404);
      if (!project.teams) project.teams = [];
      console.log('Project', project.teams);
      const team = project.teams.find((team) => team._id.toString() === teamId); // 다른방법: teamId.toString() === team._id.toString()
      console.log('team', team, teamId);
      if (!team) throw new HttpException('팀이 존재하지 않습니다.', 404);
      if (!team.members) team.members = []; // members는 User 배열입니다.
      const isUserExit = team.members.find(
        (member) => member.id.toString() === userId,
      );

      if (isUserExit) throw new HttpException('이미 존재하는 멤버입니다.', 409);

      team.members.push(_user.readOnlyData);

      project.teams.splice(
        project.teams.findIndex((team) => team._id.toString() === teamId),
        1,
        team,
      );
      await project.save();

      return _user.readOnlyData;
    } catch (error) {
      console.log('[DB] 프로젝트에서 팀에 멤버 추가 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }

  async deleteMember(teamId: string, userId: string) {
    try {
      const team = await this.teamModel.findById(teamId).exec();
      if (!team) throw new HttpException('팀이 존재하지 않습니다.', 404);
      team.members =
        team.members.filter((member) => member.id.toString() === userId) || [];
      return await team.save();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async deleteMemberInProject(
    projectId: string,
    teamId: string,
    userId: string,
  ) {
    try {
      const project = await this.projectModel.findById(projectId).exec();
      const _user = await this.userModel.findById(userId).exec();

      if (!project)
        throw new HttpException('프로젝트가 존재하지 않습니다.', 404);
      if (!project.teams) project.teams = [];
      console.log('Project', project.teams);
      const team = project.teams.find((team) => team._id.toString() === teamId); // 다른방법: teamId.toString() === team._id.toString()
      console.log('team', team, teamId);
      if (!team) throw new HttpException('팀이 존재하지 않습니다.', 404);
      if (!team.members) team.members = []; // members는 User 배열입니다.

      team.members =
        team.members.filter((member) => member.id.toString() === userId) || [];

      project.teams.splice(
        project.teams.findIndex((team) => team._id.toString() === teamId),
        1,
        team,
      );
      await project.save();

      return _user;
    } catch (error) {
      console.log('[DB] 프로젝트에서 팀에 멤버 추가 서비스단 오류', error);
      throw new HttpException(error, 500);
    }
  }
}
