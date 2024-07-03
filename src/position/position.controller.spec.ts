import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './position.controller';
import { PositionService } from './position.service'; // Adjust the import path if needed
import { UsersService } from '../users/users.service'; // Adjust the import path if needed
import { PositionEntity } from '../entities/position.entity'; // Adjust the import path if needed

describe('PositionsController', () => {
  let controller: PositionsController;
  let service: PositionService;

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
            getPositionById: jest.fn(),
            deletePosition: jest.fn(),
            getPositionChildren: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {}, // Mock UsersService methods if needed
        },
      ],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
    service = module.get<PositionService>(PositionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a position', async () => {
    const dto = {
      name: 'CTO',
      description: 'Chief Technology Officer',
      parentId: '1',
    };
    const result: PositionEntity = {
      id: '1',
      name: 'CTO',
      description: 'Chief Technology Officer',
      parent: { id: '1' } as PositionEntity, // Mock the parent position entity
      children: [],
      users: [],
    };
    jest.spyOn(service, 'createPosition').mockResolvedValue(result);

    expect(await controller.createPosition(dto)).toBe(result);
  });

  it('should update a position', async () => {
    const dto = {
      name: 'CTO',
      description: 'Chief Technology Officer',
      parentId: '1',
    };
    const result: PositionEntity = {
      id: '1',
      name: 'CTO',
      description: 'Chief Technology Officer',
      parent: { id: '1' } as PositionEntity, // Mock the parent position entity
      children: [],
      users: [],
    };
    jest.spyOn(service, 'update').mockResolvedValue(result);

    expect(await controller.update('1', dto)).toBe(result);
  });

  it('should get all positions', async () => {
    const result: PositionEntity[] = [
      {
        id: '1',
        name: 'CTO',
        description: 'Chief Technology Officer',
        parent: null,
        children: [],
        users: [],
      },
    ];
    jest.spyOn(service, 'getAllPositions').mockResolvedValue(result);

    expect(await controller.getAllPositions()).toBe(result);
  });

  it('should get position hierarchy', async () => {
    const result = [
      {
        id: '1',
        name: 'CTO',
        description: 'Chief Technology Officer',
        children: [],
      },
    ];
    jest.spyOn(service, 'getPositionHierarchy').mockResolvedValue(result);

    expect(await controller.getPositionHierarchy()).toBe(result);
  });

  it('should get position by id', async () => {
    const result: PositionEntity = {
      id: '1',
      name: 'CTO',
      description: 'Chief Technology Officer',
      parent: null,
      children: [],
      users: [],
    };
    jest.spyOn(service, 'getPositionById').mockResolvedValue(result);

    expect(await controller.getPositionById('1')).toBe(result);
  });

  it('should delete a position', async () => {
    jest.spyOn(service, 'deletePosition').mockResolvedValue(undefined);

    expect(await controller.removePosition('1')).toBeUndefined();
  });

  it('should get position children', async () => {
    const result: PositionEntity[] = [
      {
        id: '2',
        name: 'Product Manager',
        description: 'Product Manager',
        parent: { id: '1' } as PositionEntity, // Mock the parent position entity
        children: [],
        users: [],
      },
    ];
    jest.spyOn(service, 'getPositionChildren').mockResolvedValue(result);

    expect(await controller.getPositionChildren('1')).toBe(result);
  });
});
