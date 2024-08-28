import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { PhotoEntity } from '../entities/photo.entity';

describe('PhotoController', () => {
  let controller: PhotoController;
  let service: PhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
      providers: [
        {
          provide: PhotoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByFilename: jest.fn(),
            incrementViewCount: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PhotoController>(PhotoController);
    service = module.get<PhotoService>(PhotoService);
  });

  describe('create', () => {
    it('should create a new photo', async () => {
      const createDto: CreatePhotoDto = {
        name: 'Test Photo',
        description: 'Test photo description',
        filename: 'test-photo.jpg',
        views: 0,
        isPublished: false,
      };

      const createdPhoto: PhotoEntity = {
        id: 1,
        name: createDto.name,
        description: createDto.description,
        filename: createDto.filename,
        views: createDto.views,
        isPublished: createDto.isPublished,
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdPhoto);

      const result = await controller.create(createDto, null); // Adjust as per your actual test requirements

      expect(result).toEqual(createdPhoto);
    });
  });

  // Add more test cases for other controller methods as needed

  afterEach(() => {
    jest.clearAllMocks();
  });
});
