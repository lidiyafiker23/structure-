import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from '../entities/position.entity';
import { PositionsController } from './position.controller';
import { PositionService } from './position.service';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../entities/user.entity';
import { PhotoEntity } from '../entities/photo.entity';
import { PhotoModule } from '../photo/photo.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([PositionEntity, UserEntity, PhotoEntity]),
    forwardRef(() => UsersModule), // Use forwardRef for circular dependency
    PhotoModule,
  ],
  controllers: [PositionsController],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionModule {}
