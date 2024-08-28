import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from '../entities/position.entity';
import { UsersService } from '../users/users.service';

@Controller('positions')
export class PositionsController {
  constructor(
    private readonly positionService: PositionService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createPosition(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<PositionEntity> {
    return this.positionService.createPosition(createPositionDto);
  }
  
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(id, updatePositionDto);
  }

  @Get()
  async getAllPositions(): Promise<PositionEntity[]> {
    return this.positionService.getAllPositions();
  }

  @Get('hierarchy')
  async getPositionHierarchy(): Promise<any[]> {
    return this.positionService.getPositionHierarchy();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PositionEntity> {
    return this.positionService.findOne(id);
  }

  @Delete(':id')
  async removePosition(@Param('id') id: string): Promise<void> {
    try {
      await this.positionService.deletePosition(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/children')
  async getPositionChildren(
    @Param('id') id: string,
  ): Promise<PositionEntity[]> {
    return this.positionService.getPositionChildren(id);
  }
}
