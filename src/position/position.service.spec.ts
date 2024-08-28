import { Test, TestingModule } from '@nestjs/testing';
import { PositionService } from './position.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionEntity } from '../entities/position.entity';
import { UserEntity } from '../entities/user.entity';
import { PhotoEntity } from '../entities/photo.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PositionService', () => {
  let service: PositionService;
  let positionRepository: Repository<PositionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionService,
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
  });

  describe('update', () => {
    it('should update a position', async () => {
      const positionId = '1';
      const updateDto = { name: 'Updated Position', parentId: '2' };

      const position = {
        id: positionId,
        name: 'Position',
        parent: null,
      } as PositionEntity;
      const parentPosition = {
        id: '2',
        name: 'Parent Position',
      } as PositionEntity;

      jest.spyOn(positionRepository, 'findOne').mockResolvedValueOnce(position);
      jest
        .spyOn(positionRepository, 'findOne')
        .mockResolvedValueOnce(parentPosition);
      jest.spyOn(positionRepository, 'save').mockResolvedValueOnce(position);

      await expect(service.update(positionId, updateDto)).resolves.toEqual(
        position,
      );
    });

    it('should throw NotFoundException if position does not exist', async () => {
      const positionId = '1';
      const updateDto = { name: 'Updated Position' };

      jest.spyOn(positionRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(positionId, updateDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if parent position does not exist', async () => {
      const positionId = '1';
      const updateDto = { name: 'Updated Position', parentId: '2' };

      const position = {
        id: positionId,
        name: 'Position',
        parent: null,
      } as PositionEntity;

      jest.spyOn(positionRepository, 'findOne').mockResolvedValueOnce(position);
      jest.spyOn(positionRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(positionId, updateDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
