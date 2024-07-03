import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { PhotoEntity } from '../entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  providers: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
