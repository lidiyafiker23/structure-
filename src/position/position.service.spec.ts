import { Test, TestingModule } from '@nestjs/testing';
import { PositionService } from './position.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionEntity } from '../entities/position.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PhotoEntity } from '../entities/photo.entity';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UserEntity } from '../entities/user.entity'; // Import UserEntity here

describe('PositionService', () => {
  let service: PositionService;
  let positionRepository: Repository<PositionEntity>;
  let userRepository: Repository<UserEntity>;
  let photoRepository: Repository<PhotoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionService,
        UsersService,
        {
          provide: getRepositoryToken(PositionEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PhotoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PositionService>(PositionService);
    positionRepository = module.get<Repository<PositionEntity>>(
      getRepositoryToken(PositionEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    photoRepository = module.get<Repository<PhotoEntity>>(
      getRepositoryToken(PhotoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPosition', () => {
    it('should create a new position', async () => {
      const createPositionDto: CreatePositionDto = {
        name: 'CTO',
        description: 'Chief Technology Officer',
        parentId: null,
      };

      jest.spyOn(positionRepository, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(positionRepository, 'create')
        .mockReturnValueOnce(createPositionDto as any);
      jest
        .spyOn(positionRepository, 'save')
        .mockResolvedValueOnce(createPositionDto as any);

      const result = await service.createPosition(createPositionDto);
      expect(result).toEqual(createPositionDto);
    });

    it('should throw NotFoundException if parent position not found', async () => {
      const createPositionDto: CreatePositionDto = {
        name: 'CTO',
        description: 'Chief Technology Officer',
        parentId: 'invalid-id',
      };

      jest.spyOn(positionRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.createPosition(createPositionDto),
      ).rejects.toThrowError(NotFoundException);
    });

    // Add more test cases for createPosition as needed
  });

  describe('update', () => {
    it('should update a position', async () => {
      const updatePositionDto: UpdatePositionDto = {
        name: 'Updated CTO',
        description: 'Updated Chief Technology Officer',
        parentId: null,
      };

      const positionToUpdate: PositionEntity = {
        id: '1',
        name: 'CTO',
        description: 'Chief Technology Officer',
        parent: null,
        children: [],
        users: [],
      };

      jest
        .spyOn(positionRepository, 'findOne')
        .mockResolvedValueOnce(positionToUpdate);
      jest.spyOn(positionRepository, 'save').mockResolvedValueOnce({
        ...positionToUpdate,
        ...updatePositionDto,
      } as any);

      const result = await service.update('1', updatePositionDto);
      expect(result).toEqual({ ...positionToUpdate, ...updatePositionDto });
    });

    it('should throw NotFoundException if position not found', async () => {
      const updatePositionDto: UpdatePositionDto = {
        name: 'Updated CTO',
        description: 'Updated Chief Technology Officer',
        parentId: null,
      };

      jest.spyOn(positionRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update('1', updatePositionDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    // Add more test cases for update as needed
  });

  // Add tests for other methods like getAllPositions, getPositionById, deletePosition, getPositionChildren, etc.
});
