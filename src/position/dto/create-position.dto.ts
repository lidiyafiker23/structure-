import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsUUID()
  parentId?: string; // Optional parent ID, used for establishing parent-child relationships
}
