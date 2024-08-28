import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllQueryDto {
  @IsOptional()
  @IsString()
  q?: string = '';

  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  page?: number = 1;

  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  limit?: number = 10;
}
