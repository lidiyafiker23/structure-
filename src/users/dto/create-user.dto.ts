import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsUUID() // Assuming positionId is a UUID, adjust as per your position entity
  positionId: string;

  @IsOptional()
  @IsUUID() // Optional: If you want to associate a photo during creation
  photoId?: string;
}
