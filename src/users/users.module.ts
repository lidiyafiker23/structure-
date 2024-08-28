import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from '../entities/user.entity';
import { PositionEntity } from '../entities/position.entity';
import { PhotoEntity } from '../entities/photo.entity';
import { PositionModule } from '../position/position.module';
import { PhotoService } from '../photo/photo.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PositionEntity, PhotoEntity]),
    forwardRef(() => PositionModule), // Use forwardRef for circular dependency
  ],
  controllers: [UsersController],
  providers: [UsersService,PhotoService],
  exports: [UsersService],
})
export class UsersModule {}
