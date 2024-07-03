import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from '../entities/user.entity';
import { PositionEntity } from '../entities/position.entity';
import { PhotoEntity } from '../entities/photo.entity';
import { PositionModule } from '../position/position.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PositionEntity, PhotoEntity]),
    forwardRef(() => PositionModule), // Use forwardRef for PositionModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
