import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { PhotoEntity } from '../entities/photo.entity';

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createPhotoDto: CreatePhotoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createdPhoto = await this.photoService.create(
      createPhotoDto,
      file.filename,
    );
    return createdPhoto;
  }

  @Get()
  async findAll(): Promise<PhotoEntity[]> {
    const photos = await this.photoService.findAll();
    return photos;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PhotoEntity> {
    const photo = await this.photoService.findOne(id);
    if (!photo) {
      throw new NotFoundException(`Photo with ID "${id}" not found`);
    }
    return photo;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ): Promise<PhotoEntity> {
    const updatedPhoto = await this.photoService.update(id, updatePhotoDto);
    return updatedPhoto;
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.photoService.remove(id);
  }

  // New route to serve the photo and increment the view count
  @Get('view/:filename')
  async viewPhoto(@Param('filename') filename: string, @Res() res: Response) {
    const photo = await this.photoService.findByFilename(filename);
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    await this.photoService.incrementViewCount(photo.id);

    res.setHeader('Content-Type', 'image/jpeg');
    return res.sendFile(join(process.cwd(), 'uploads', filename));
  }
}
