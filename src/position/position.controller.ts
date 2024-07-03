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
import { PositionService } from './position.service'; // Replace with actual service name
import { CreatePositionDto } from './dto/create-position.dto'; // Define DTO as needed
import { UpdatePositionDto } from './dto/update-position.dto'; // Define DTO as needed
import { PositionEntity } from '../entities/position.entity'; // Replace with actual entity name

import { UsersService } from '../users/users.service';
@Controller('positions')
export class PositionsController {
  constructor(
    private readonly positionService: PositionService,
    private readonly usersService: UsersService,
  ) {}

  @Post() // POST /positions
  async createPosition(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<PositionEntity> {
    return this.positionService.createPosition(createPositionDto);
  }

  // PUT /positions/:id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(id, updatePositionDto);
  }

  // GET /positions
  @Get()
  async getAllPositions(): Promise<PositionEntity[]> {
    return this.positionService.getAllPositions();
  }

  @Get('hierarchy')
  async getPositionHierarchy(): Promise<any[]> {
    return this.positionService.getPositionHierarchy();
  }
  // GET /positions/:id
  @Get(':id')
  async getPositionById(@Param('id') id: string): Promise<PositionEntity> {
    return this.positionService.getPositionById(id);
  }

  // DELETE /positions/:id
  @Delete(':id')
  async removePosition(@Param('id') id: string): Promise<void> {
    try {
      await this.positionService.deletePosition(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // GET /positions/:id/children
  @Get(':id/children')
  async getPositionChildren(
    @Param('id') id: string,
  ): Promise<PositionEntity[]> {
    return this.positionService.getPositionChildren(id);
  }

  // GET /positions/hierarchy
}
