import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  // PATCH /users/:id
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // GET /users
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  // GET /users/:id
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    return this.usersService.getUserById(id);
  }

  // DELETE /users/:id
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
