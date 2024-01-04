import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserModel', // Replace 'UserModel' with the actual name of your UserModel
          useValue: Model, // Replace 'Model' with the actual implementation of your UserModel
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('should return an array of users', () => {
    const result = service.findAll();
    expect(result).toHaveLength(29);
  });
});
