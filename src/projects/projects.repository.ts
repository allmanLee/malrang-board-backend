import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './projects.schema';
import { ProjectRequestDto } from './dto/projects.request.dto';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
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

  async findAll() {
    return await this.projectModel.find().exec();
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
}
