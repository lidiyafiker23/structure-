import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './position.controller';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from '../entities/position.entity';
import { UsersService } from '../users/users.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('PositionsController', () => {
  let controller: PositionsController;
  let positionService: PositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [
        {
          provide: PositionService,
          useValue: {
            createPosition: jest.fn(),
            update: jest.fn(),
            getAllPositions: jest.fn(),
            getPositionHierarchy: jest.fn(),
            findOne: jest.fn(),
            removePosition: jest.fn(),
            getPositionChildren: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
    positionService = module.get<PositionService>(PositionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPosition', () => {
    it('should create a new position', async () => {
      const createDto: CreatePositionDto = {
        name: 'Test Position',
        description: 'Test position description',
        parentId: null,
      };

      const newPosition: PositionEntity = {
        id: '1',
        name: createDto.name,
        description: createDto.description,
        parent: null,
        children: [],
        users: [],
      };

      jest
        .spyOn(positionService, 'createPosition')
        .mockResolvedValue(newPosition);

      const result = await controller.createPosition(createDto);

      expect(result).toEqual(newPosition);
    });
  });

  describe('update', () => {
    it('should update a position', async () => {
      const updateDto: UpdatePositionDto = {
        name: 'Updated Position',
        description: 'Updated position description',
        parentId: null,
      };

      const updatedPosition: PositionEntity = {
        id: '1',
        name: updateDto.name,
        description: updateDto.description,
        parent: null,
        children: [],
        users: [],
      };

      jest.spyOn(positionService, 'update').mockResolvedValue(updatedPosition);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(updatedPosition);
    });

    it('should throw NotFoundException for non-existent position', async () => {
      jest
        .spyOn(positionService, 'update')
        .mockRejectedValue(new NotFoundException('Position not found'));

      try {
        await controller.update('999', { name: 'Updated Position' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Position not found');
      }
    });
  });

  describe('getAllPositions', () => {
    it('should return all positions', async () => {
      const positions: PositionEntity[] = [
        {
          id: '1',
          name: 'Position 1',
          description: 'Description 1',
          parent: null,
          children: [],
          users: [],
        },
        {
          id: '2',
          name: 'Position 2',
          description: 'Description 2',
          parent: null,
          children: [],
          users: [],
        },
      ];

      jest
        .spyOn(positionService, 'getAllPositions')
        .mockResolvedValue(positions);

      const result = await controller.getAllPositions();

      expect(result).toEqual(positions);
    });
  });

  describe('getPositionHierarchy', () => {
    it('should return position hierarchy', async () => {
      const hierarchyData = [
        {
          id: '1',
          name: 'Position 1',
          description: 'Description 1',
          children: [
            {
              id: '2',
              name: 'Position 2',
              description: 'Description 2',
              children: [],
            },
          ],
        },
      ];

      jest
        .spyOn(positionService, 'getPositionHierarchy')
        .mockResolvedValue(hierarchyData);

      const result = await controller.getPositionHierarchy();

      expect(result).toEqual(hierarchyData);
    });
  });

  describe('findOne', () => {
    it('should return a position by id', async () => {
      const position: PositionEntity = {
        id: '1',
        name: 'Position 1',
        description: 'Description 1',
        parent: null,
        children: [],
        users: [],
      };

      jest.spyOn(positionService, 'findOne').mockResolvedValue(position);

      const result = await controller.findOne('1');

      expect(result).toEqual(position);
    });

    it('should throw NotFoundException for non-existent position', async () => {
      jest
        .spyOn(positionService, 'findOne')
        .mockRejectedValue(new NotFoundException('Position not found'));

      try {
        await controller.findOne('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Position not found');
      }
    });
  });

  describe('removePosition', () => {
    it('should remove a position by id', async () => {
      const id = '1';

      jest.spyOn(positionService, 'deletePosition').mockResolvedValue();

      await expect(controller.removePosition(id)).resolves.not.toThrow();
    });

    it('should throw HttpException for internal server error', async () => {
      const id = '999';

      jest
        .spyOn(positionService, 'deletePosition')
        .mockRejectedValue(new Error('Internal Server Error'));

      try {
        await controller.removePosition(id);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Internal Server Error');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getPositionChildren', () => {
    it('should return children positions of a parent', async () => {
      const childrenPositions: PositionEntity[] = [
        {
          id: '2',
          name: 'Child Position 1',
          description: 'Child Position 1 description',
          parent: { id: '1' } as PositionEntity,
          children: [],
          users: [],
        },
      ];

      jest
        .spyOn(positionService, 'getPositionChildren')
        .mockResolvedValue(childrenPositions);

      const result = await controller.getPositionChildren('1');

      expect(result).toEqual(childrenPositions);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
