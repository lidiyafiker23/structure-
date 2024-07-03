import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from '../entities/position.entity';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { PhotoEntity } from '../entities/photo.entity';
@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
    @InjectRepository(UserEntity) // Inject UserEntity repository
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UsersService,
    @InjectRepository(PhotoEntity) // Inject PhotoEntity repository
    private readonly photoRepository: Repository<PhotoEntity>,
  ) {}

  async createPosition(
    createPositionDto: CreatePositionDto,
  ): Promise<PositionEntity> {
    const { name, description, parentId } = createPositionDto;

    let parentPosition: PositionEntity | null = null;
    if (parentId) {
      parentPosition = await this.positionRepository.findOne({
        where: { id: parentId },
      });
      if (!parentPosition) {
        throw new NotFoundException(
          `Parent position with ID ${parentId} not found.`,
        );
      }
    }

    const newPosition = this.positionRepository.create({
      name,
      description,
      parent: parentPosition,
    });

    return this.positionRepository.save(newPosition);
  }

  async update(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<PositionEntity> {
    const position = await this.positionRepository.findOne({ where: { id } });
    if (!position) {
      throw new NotFoundException('Position not found');
    }
    if (updatePositionDto.parentId) {
      const parent = await this.positionRepository.findOne({
        where: { id: updatePositionDto.parentId },
      });
      if (!parent) {
        throw new BadRequestException('Parent position not found');
      }
      position.parent = parent;
    }
    Object.assign(position, updatePositionDto);
    return this.positionRepository.save(position);
  }

  async getAllPositions(): Promise<PositionEntity[]> {
    return await this.positionRepository.find();
  }

  async getPositionById(id: string): Promise<PositionEntity> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'users'],
    });
    if (!position) {
      throw new NotFoundException('Position not found');
    }
    return position;
  }

  async deletePosition(id: string): Promise<void> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'users', 'users.photo'],
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found.`);
    }

    if (position.parent && position.children.length > 0) {
      for (const child of position.children) {
        child.parent = position.parent;
        await this.positionRepository.save(child);
      }
    }

    for (const user of position.users) {
      if (user.photo) {
        await this.photoRepository.remove(user.photo);
      }
      await this.userRepository.remove(user);
    }

    await this.positionRepository.delete(id);
  }

  async getPositionChildren(id: string): Promise<PositionEntity[]> {
    return await this.positionRepository.find({ where: { parent: { id } } });
  }
  async getPositionHierarchy(): Promise<any[]> {
    try {
      const positions = await this.positionRepository.find({
        relations: ['parent', 'children'],
      });
      console.log('Positions fetched:', JSON.stringify(positions, null, 2));
      const hierarchy = this.buildHierarchy(positions, null);
      console.log('Hierarchy built:', JSON.stringify(hierarchy, null, 2));
      return hierarchy;
    } catch (error) {
      console.error(
        'Error getting position hierarchy:',
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get position hierarchy',
      );
    }
  }

  private buildHierarchy(
    positions: PositionEntity[],
    parentId: string | null,
  ): any[] {
    const hierarchy = [];
    for (const position of positions) {
      console.log(
        `Checking position: ${position.name} with parent ID: ${
          position.parent?.id || 'undefined'
        }`,
      );
      if (
        (parentId === null && !position.parent) ||
        position.parent?.id === parentId
      ) {
        const children = this.buildHierarchy(positions, position.id);
        const positionDto = {
          id: position.id,
          name: position.name,
          description: position.description,
          children: children.length > 0 ? children : [],
        };
        hierarchy.push(positionDto);
      }
    }
    return hierarchy;
  }
}
