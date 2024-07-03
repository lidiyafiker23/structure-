import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { PhotoEntity } from '../entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(PhotoEntity)
    private readonly photoRepository: Repository<PhotoEntity>,
  ) {}

  async create(
    createPhotoDto: CreatePhotoDto,
    filename: string,
  ): Promise<PhotoEntity> {
    const photo = this.photoRepository.create({
      ...createPhotoDto,
      filename,
      views: 0, // Ensure views default to 0
    });
    return this.photoRepository.save(photo);
  }
  findAll(): Promise<PhotoEntity[]> {
    return this.photoRepository.find();
  }

  async findOne(
    identifier: string | number | FindOneOptions<PhotoEntity>,
  ): Promise<PhotoEntity> {
    let options: FindOneOptions<PhotoEntity>;

    if (typeof identifier === 'object') {
      options = identifier;
    } else {
      // Assuming identifier is a string or number (usually an ID)
      options = { where: { id: +identifier } }; // Convert to number
    }

    const photo = await this.photoRepository.findOne(options);

    if (!photo) {
      if (typeof identifier === 'object') {
        const criteria = JSON.stringify(identifier);
        throw new NotFoundException(
          `Photo with criteria ${criteria} not found`,
        );
      } else {
        throw new NotFoundException(`Photo with ID "${identifier}" not found`);
      }
    }

    return photo;
  }

  async findByFilename(filename: string): Promise<PhotoEntity> {
    const options: FindOneOptions<PhotoEntity> = {
      where: { filename },
    };
    return this.findOne(options);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.photoRepository.increment({ id }, 'views', 1);
  }

  async update(
    id: number,
    updatePhotoDto: UpdatePhotoDto,
  ): Promise<PhotoEntity> {
    const photo = await this.photoRepository.preload({
      id,
      ...updatePhotoDto,
    });

    if (!photo) {
      throw new NotFoundException(`Photo with ID "${id}" not found`);
    }

    return this.photoRepository.save(photo);
  }

  async remove(id: string): Promise<void> {
    const photo = await this.findOne(id);
    await this.photoRepository.remove(photo);
  }
}
