import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PhotoEntity } from './entities/photo.entity';
import { PositionEntity } from './entities/position.entity';
import { UsersModule } from './users/users.module';
import { PositionModule } from './position/position.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'kidiya',
      database: 'orga_structure',
      entities: [UserEntity, PhotoEntity, PositionEntity],
      synchronize: true, // Note: Use with caution in production
    }),
    UsersModule,
    PositionModule,
    PhotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
