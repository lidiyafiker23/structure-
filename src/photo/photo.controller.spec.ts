import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('PhotoController', () => {
  let controller: PhotoController;
  let photoService: PhotoService;

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
    photoService = module.get<PhotoService>(PhotoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new photo', async () => {
      const createPhotoDto: CreatePhotoDto = {
        name: 'Test Photo',
        description: 'Test Description',
        filename: 'test-photo.jpg', // Add filename
        views: 0, // Add views
        isPublished: false, // Add isPublished
      };
      const createdPhoto = {} as any; // Replace with your mock photo object

      jest.spyOn(photoService, 'create').mockResolvedValueOnce(createdPhoto);

      const result = await controller.create(createPhotoDto, {} as any);
      expect(result).toBe(createdPhoto);
    });
  });

  // Other test cases omitted for brevity
});
