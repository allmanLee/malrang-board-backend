import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Model } from 'mongoose';
import { ProjectsRepository } from './projects.repository';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: 'ProjectModel', // Replace 'ProjectModel' with the actual name of your ProjectModel
          useValue: Model, // Replace 'Model' with the actual implementation of your ProjectModel
        },
        ProjectsRepository,
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should return an array of projects', () => {
    const result = service.findAll();
    expect(result).toHaveLength(29);
  });
});
