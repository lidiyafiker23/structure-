// photo.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PhotoEntity } from '../entities/photo.entity';
import { Repository } from 'typeorm';
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
        filename: 'test-photo.jpg',
        views: 0,
        isPublished: false,
      };

      jest
        .spyOn(repository, 'create')
        .mockReturnValueOnce(createPhotoDto as any);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce(createPhotoDto as any);

      const result = await service.create(
        createPhotoDto,
        createPhotoDto.filename,
      );
      expect(result).toEqual(createPhotoDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of photos', async () => {
      const photoEntity: PhotoEntity = {
        id: 1,
        name: 'Test Photo',
        description: 'Test Description',
        filename: 'test-photo.jpg',
        views: 0,
        isPublished: false,
      };

      jest.spyOn(repository, 'find').mockResolvedValueOnce([photoEntity]);

      const result = await service.findAll();
      expect(result).toEqual([photoEntity]);
    });
  });

  describe('findOne', () => {
    it('should return a photo by ID', async () => {
      const photoEntity: PhotoEntity = {
        id: 1,
        name: 'Test Photo',
        description: 'Test Description',
        filename: 'test-photo.jpg',
        views: 0,
        isPublished: false,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(photoEntity);

      const result = await service.findOne(1);
      expect(result).toEqual(photoEntity);
    });

    it('should throw NotFoundException if photo with given ID is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a photo by ID', async () => {
      const updatePhotoDto: UpdatePhotoDto = {
        name: 'Updated Photo Name',
        description: 'Updated Description',
        filename: 'test-photo.jpg',
        views: 10,
        isPublished: true,
      };

      const existingPhoto: PhotoEntity = {
        id: 1,
        name: 'Original Photo Name',
        description: 'Original Description',
        filename: 'test-photo.jpg',
        views: 0,
        isPublished: false,
      };

      jest.spyOn(repository, 'preload').mockResolvedValueOnce(existingPhoto);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce({ ...existingPhoto, ...updatePhotoDto });

      const result = await service.update(1, updatePhotoDto);
      expect(result).toEqual({ ...existingPhoto, ...updatePhotoDto });
    });

    it('should throw NotFoundException if photo with given ID is not found', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValueOnce(undefined);

      const updatePhotoDto: UpdatePhotoDto = {
        name: 'Updated Photo Name',
        description: 'Updated Description',
        filename: 'test-photo.jpg',
        views: 10,
        isPublished: true,
      };

      await expect(service.update(999, updatePhotoDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a photo by ID', async () => {
      const existingPhoto: PhotoEntity = {
        id: 1,
        name: 'Test Photo',
        description: 'Test Description',
        filename: 'test-photo.jpg',
        views: 0,
        isPublished: false,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingPhoto);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(undefined);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(existingPhoto);
    });

    it('should throw NotFoundException if photo with given ID is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('incrementViewCount', () => {
    it('should increment view count of a photo by ID', async () => {
      const existingPhoto: PhotoEntity = {
        id: 1,
        name: 'Test Photo',
        description: 'Test Description',
        filename: 'test-photo.jpg',
        views: 0,
        isPublished: false,
      };

      jest.spyOn(repository, 'increment').mockResolvedValueOnce({} as any);

      await service.incrementViewCount(1);

      expect(repository.increment).toHaveBeenCalledWith({ id: 1 }, 'views', 1);
    });
  });
});
