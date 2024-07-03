import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoEntity } from '../entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { NotFoundException } from '@nestjs/common';

describe('PhotoService', () => {
  let service: PhotoService;
  let repository: Repository<PhotoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoService,
        {
          provide: getRepositoryToken(PhotoEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PhotoService>(PhotoService);
    repository = module.get<Repository<PhotoEntity>>(
      getRepositoryToken(PhotoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new photo', async () => {
      const createPhotoDto: CreatePhotoDto = {
        name: 'Test Photo',
        description: 'Test Description',
        filename: 'test.jpg',
        views: 0,
        isPublished: false,
      };

      const mockPhoto = new PhotoEntity();
      mockPhoto.id = 1;
      mockPhoto.name = createPhotoDto.name;
      mockPhoto.description = createPhotoDto.description;
      mockPhoto.filename = createPhotoDto.filename;
      mockPhoto.views = createPhotoDto.views;

      jest.spyOn(repository, 'create').mockReturnValue(mockPhoto);
      jest.spyOn(repository, 'save').mockResolvedValue(mockPhoto);

      const result = await service.create(
        createPhotoDto,
        createPhotoDto.filename,
      );
      expect(result).toEqual(mockPhoto);
    });
  });

  describe('findOne', () => {
    it('should find a photo by ID', async () => {
      const mockPhotoId = 1;
      const mockPhoto = new PhotoEntity();
      mockPhoto.id = mockPhotoId;
      mockPhoto.name = 'Test Photo';
      mockPhoto.description = 'Test Description';
      mockPhoto.filename = 'test.jpg';
      mockPhoto.views = 0;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPhoto);

      const result = await service.findOne(mockPhotoId);
      expect(result).toEqual(mockPhoto);
    });

    it('should throw NotFoundException if photo with given ID does not exist', async () => {
      const mockPhotoId = 999;

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(mockPhotoId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing photo', async () => {
      const mockPhotoId = 1;
      const updatePhotoDto: UpdatePhotoDto = {
        name: 'Updated Photo Name',
        description: 'Updated Description',
      };

      const mockExistingPhoto = new PhotoEntity();
      mockExistingPhoto.id = mockPhotoId;
      mockExistingPhoto.name = 'Test Photo';
      mockExistingPhoto.description = 'Test Description';
      mockExistingPhoto.filename = 'test.jpg';
      mockExistingPhoto.views = 0;

      const mockUpdatedPhoto = new PhotoEntity();
      mockUpdatedPhoto.id = mockPhotoId;
      mockUpdatedPhoto.name = updatePhotoDto.name;
      mockUpdatedPhoto.description = updatePhotoDto.description;
      mockUpdatedPhoto.filename = 'test.jpg';
      mockUpdatedPhoto.views = 0;

      jest.spyOn(repository, 'preload').mockResolvedValue(mockUpdatedPhoto);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUpdatedPhoto);

      const result = await service.update(mockPhotoId, updatePhotoDto);
      expect(result).toEqual(mockUpdatedPhoto);
    });

    it('should throw NotFoundException if photo to update does not exist', async () => {
      const mockPhotoId = 999;
      const updatePhotoDto: UpdatePhotoDto = {
        name: 'Updated Photo Name',
        description: 'Updated Description',
      };

      jest.spyOn(repository, 'preload').mockResolvedValue(undefined);

      await expect(service.update(mockPhotoId, updatePhotoDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

 describe('remove', () => {
   it('should delete a photo by ID', async () => {
     const mockPhotoId = '1'; // Ensure mockPhotoId is treated as a string
     const mockPhoto = new PhotoEntity();
     mockPhoto.id = 1;
     mockPhoto.name = 'Test Photo';
     mockPhoto.description = 'Test Description';
     mockPhoto.filename = 'test.jpg';
     mockPhoto.views = 0;

     jest.spyOn(service, 'findOne').mockResolvedValue(mockPhoto);
     jest.spyOn(repository, 'remove').mockResolvedValue(undefined); // Ensure remove is correctly mocked

     await service.remove(mockPhotoId);
     expect(repository.remove).toHaveBeenCalledWith(mockPhoto);
   });

   it('should throw NotFoundException if photo to delete does not exist', async () => {
     const mockPhotoId = '999'; // Ensure mockPhotoId is treated as a string

     jest.spyOn(service, 'findOne').mockResolvedValue(undefined); // Ensure findOne resolves to undefined

     await expect(service.remove(mockPhotoId)).rejects.toThrow(
       NotFoundException,
     );
   });
 });


  // Add more tests for other methods as needed
});
