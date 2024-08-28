import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PositionService } from './../../src/position/position.service';
import { PhotoService } from '../photo/photo.service'
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private positionService: PositionService,
    private photoService: PhotoService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    Object.assign(user, createUserDto);
    if (createUserDto.positionId) {
      user.position = await this.positionService.findOne(
        createUserDto.positionId,
      );
    }
    if (createUserDto.photoId) {
      user.photo = await this.photoService.findOne(createUserDto.photoId);
    }

    try {
      return await this.userRepository.save(user);
    } catch (err: unknown) {
      if (
        err instanceof QueryFailedError &&
        err.driverError?.code === '23505'    //23505, which indicates a unique constraint violation.
      ) {
        if ((err.driverError?.detail as string).includes('email')) {
          throw new BadRequestException(
            'Employee with this email already exists.',
          );
        } else {
          throw new BadRequestException(
            'Employee with this phone number already exists.',
          );
        }
      }
      throw err;
    }
  }


//   Summary
// This method handles the creation of a new user entity:

// Creates a new UserEntity and assigns properties from the DTO.
// Sets the user's position and photo based on provided IDs.
// Attempts to save the user to the database.
// Catches and handles unique constraint violations, providing specific error messages for email and phone number conflicts.

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (updateUserDto.positionId) {
      user.position = await this.positionService.findOne(
        updateUserDto.positionId,
      );
    }
    Object.assign(user, updateUserDto);

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      throw new BadRequestException(`Error updating user: ${err.message}`);
    }
    
  }

  async findOne(id: string): Promise<UserEntity> {
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

  async findAll(
    q = '',
    page = 1,
    limit = 10,
  ): Promise<{
    page: number;
    limit: number;
    total: number;
    pages: number;
    results: UserEntity[];
  }> {
    const skip = (page - 1) * limit;
    const [results, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      where: { fullName: Like(`%${q}%`) },
      order: { fullName: 'ASC' },
    });

    const pages = Math.ceil(total / limit);

    return { page, limit, total, pages, results };
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
