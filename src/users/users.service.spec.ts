import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from '../entities/user.entity';
import { PositionEntity } from '../entities/position.entity';
import { PhotoEntity } from '../entities/photo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>;
  let positionRepository: Repository<PositionEntity>;
  let photoRepository: Repository<PhotoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PositionEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PhotoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    positionRepository = module.get<Repository<PositionEntity>>(
      getRepositoryToken(PositionEntity),
    );
    photoRepository = module.get<Repository<PhotoEntity>>(
      getRepositoryToken(PhotoEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        positionId: '1',
        photoId: '1',
      };

      const position: PositionEntity = {
        id: '1',
        name: 'Developer',
        description: 'Senior Developer',
        parent: null,
        children: [],
        users: [],
      };

      const photo: PhotoEntity = {
        id: 1,
        name: 'Profile Photo',
        filename: 'john_doe.jpg',
        description: 'Profile photo',
        views: 0,
        isPublished: true,
      };

      jest.spyOn(positionRepository, 'findOne').mockResolvedValue(position);
      jest.spyOn(photoRepository, 'findOne').mockResolvedValue(photo);
      jest.spyOn(userRepository, 'create').mockReturnValue({
        ...createUserDto,
        position,
        photo,
        isActive: true,
      } as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...createUserDto,
        position,
        photo,
        isActive: true,
      } as any);

      const result = await service.createUser(createUserDto);
      expect(result).toBeDefined();
      expect(result.firstName).toEqual(createUserDto.firstName);
      expect(result.lastName).toEqual(createUserDto.lastName);
      expect(result.position).toEqual(position);
      expect(result.photo).toEqual(photo);
      expect(result.isActive).toEqual(true);
    });

    it('should throw NotFoundException if position not found', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        positionId: '999', // Invalid position ID
        photoId: '1',
      };

      jest.spyOn(positionRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.createUser(createUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if photo not found', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        positionId: '1',
        photoId: '999', // Invalid photo ID
      };

      const position: PositionEntity = {
        id: '1',
        name: 'Developer',
        description: 'Senior Developer',
        parent: null,
        children: [],
        users: [],
      };

      jest.spyOn(positionRepository, 'findOne').mockResolvedValue(position);
      jest.spyOn(photoRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.createUser(createUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        position: { id: '1' } as any,
        photo: { id: 1 } as any,
        isActive: true,
      };

      const updateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        positionId: '2', // Update position ID
        photoId: '2', // Update photo ID
        isActive: false,
      };

      const newPosition: PositionEntity = {
        id: '2',
        name: 'Tester',
        description: 'Senior Tester',
        parent: null,
        children: [],
        users: [],
      };

      const newPhoto: PhotoEntity = {
        id: 2,
        name: 'Updated Photo',
        filename: 'jane_doe.jpg',
        description: 'Updated profile photo',
        views: 0,
        isPublished: true,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(positionRepository, 'findOne').mockResolvedValue(newPosition);
      jest.spyOn(photoRepository, 'findOne').mockResolvedValue(newPhoto);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...user,
        ...updateUserDto,
        position: newPosition,
        photo: newPhoto,
      } as any);

      const result = await service.updateUser(1, updateUserDto);
      expect(result).toBeDefined();
      expect(result.firstName).toEqual(updateUserDto.firstName);
      expect(result.lastName).toEqual(updateUserDto.lastName);
      expect(result.position).toEqual(newPosition);
      expect(result.photo).toEqual(newPhoto);
      expect(result.isActive).toEqual(false);
    });

    it('should throw NotFoundException when updating non-existing user', async () => {
      const updateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        positionId: '1',
        photoId: '1',
        isActive: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.updateUser(1, updateUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if position not found during update', async () => {
      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        position: { id: '1' } as any,
        photo: { id: 1 } as any,
        isActive: true,
      };

      const updateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        positionId: '999', // Invalid position ID
        photoId: '1',
        isActive: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(positionRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.updateUser(1, updateUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if photo not found during update', async () => {
      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        position: { id: '1' } as any,
        photo: { id: 1 } as any,
        isActive: true,
      };

      const updateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        positionId: '1',
        photoId: '999', // Invalid photo ID
        isActive: false,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(positionRepository, 'findOne')
        .mockResolvedValue({ id: '1' } as any);
      jest.spyOn(photoRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.updateUser(1, updateUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        position: { id: '1' } as any,
        photo: { id: 1 } as any,
        isActive: true,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.getUserById(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user ID not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getUserById(1)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: UserEntity[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          position: { id: '1' } as any,
          photo: { id: 1 } as any,
          isActive: true,
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          position: { id: '2' } as any,
          photo: { id: 2 } as any,
          isActive: true,
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.getAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user: UserEntity = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        position: { id: '1' } as any,
        photo: { id: 1 } as any,
        isActive: true,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(undefined);

      await service.remove(1);
      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException when removing non-existing user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.remove(1)).rejects.toThrowError(NotFoundException);
    });
  });
});
