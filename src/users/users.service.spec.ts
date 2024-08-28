import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, Gender } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PositionService } from '../../src/position/position.service';
import { PhotoService } from '../../src/photo/photo.service';
import { PositionEntity } from '../entities/position.entity'; // Import PositionEntity

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<UserEntity>;
  let positionService: PositionService;
  let photoService: PhotoService;

  const createUserDto: CreateUserDto = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    birthDate: new Date('1990-01-01'),
    hireDate: new Date('2020-01-01'),
    gender: Gender.Male,
    positionId: '1', // Correctly typed positionId
    photoId: 'yyy',
  };

  const updateUserDto: UpdateUserDto = {
    fullName: 'Updated Name',
    email: 'updated.email@example.com',
    phone: '0987654321',
    birthDate: new Date('1995-01-01'),
    hireDate: new Date('2021-01-01'),
    gender: Gender.Female,
    positionId: '2', // Correctly typed positionId
    photoId: 'www',
  };

  const USER_REPO_TOKEN = getRepositoryToken(UserEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPO_TOKEN,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: PositionService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PhotoService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<UserEntity>>(USER_REPO_TOKEN);
    positionService = module.get<PositionService>(PositionService);
    photoService = module.get<PhotoService>(PhotoService);
  });

  it('should create a user', async () => {
    // Mocking the findOne method of PositionService
    jest.spyOn(positionService, 'findOne').mockResolvedValue({
      id: 1,
      name: 'Manager',
      description: 'Manager position',
      parent: null, // Mocking additional properties required by PositionEntity
      children: [],
      users: [],
    } as unknown as PositionEntity); // Casting to unknown first, then to PositionEntity

    await service.createUser(createUserDto);

    expect(positionService.findOne).toHaveBeenCalledWith('1'); // Ensure correct argument type
    expect(repo.save).toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const mockUser = new UserEntity();
    mockUser.id = 'mockUserId';
    mockUser.fullName = 'John Doe';
    mockUser.email = 'john.doe@example.com';
    mockUser.phone = '1234567890';
    // mock other properties as needed

    jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(positionService, 'findOne').mockResolvedValue({
      id: 2,
      name: 'Supervisor',
      description: 'Supervisor position',
      parent: null, // Mocking additional properties required by PositionEntity
      children: [],
      users: [],
    } as unknown as PositionEntity); // Casting to unknown first, then to PositionEntity

    await service.updateUser('mockUserId', updateUserDto);

    expect(positionService.findOne).toHaveBeenCalledWith('2'); // Ensure correct argument type
    expect(repo.save).toHaveBeenCalled();
  });

  // Other test cases...
});
