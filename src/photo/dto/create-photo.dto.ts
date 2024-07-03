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
  views: number;

  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;

  // Example of adding a default value
  constructor(createPhotoDto: Partial<CreatePhotoDto>) {
    Object.assign(this, createPhotoDto);
    this.isPublished = this.isPublished || false; // Default to false if not specified
  }
}
