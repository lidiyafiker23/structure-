import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsNumber()
  views?: number;

  @IsNotEmpty()
  @IsBoolean()
  isPublished?: boolean;

  constructor(createPhotoDto: Partial<CreatePhotoDto>) {
    Object.assign(this, createPhotoDto);
    this.views = this.views || 0;
    this.isPublished = this.isPublished || false;
  }
}
