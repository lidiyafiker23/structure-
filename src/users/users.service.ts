import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PositionEntity } from '../entities/position.entity';
import { PhotoEntity } from '../entities/photo.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
    @InjectRepository(PhotoEntity)
    private readonly photoRepository: Repository<PhotoEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { firstName, lastName, positionId, photoId } = createUserDto;

    const position = await this.positionRepository.findOne({
      where: { id: positionId },
    });
    if (!position) {
      throw new NotFoundException(`Position with ID "${positionId}" not found`);
    }

    let photo: PhotoEntity | undefined;
    if (photoId) {
      photo = await this.photoRepository.findOne({ where: { id: +photoId } });
      if (!photo) {
        throw new NotFoundException(`Photo with ID "${photoId}" not found`);
      }
    }

    const user = this.userRepository.create({
      firstName,
      lastName,
      position,
      photo,
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['position', 'photo'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { firstName, lastName, positionId, isActive, photoId } =
      updateUserDto;

    if (positionId !== undefined) {
      const position = await this.positionRepository.findOne({
        where: { id: positionId },
      });
      if (!position) {
        throw new NotFoundException(
          `Position with ID "${positionId}" not found`,
        );
      }
      user.position = position;
    }
    if (photoId !== undefined) {
      const photoIdNumber = Number(photoId);
      if (isNaN(photoIdNumber)) {
        throw new NotFoundException(`Photo with ID "${photoId}" not found`);
      }
      const photo = await this.photoRepository.findOne({
        where: { id: photoIdNumber },
      });
      if (!photo) {
        throw new NotFoundException(`Photo with ID "${photoId}" not found`);
      }
      user.photo = photo;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;

    return this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['position', 'photo'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({ relations: ['position', 'photo'] });
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
