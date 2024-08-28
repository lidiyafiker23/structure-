import { Gender } from '../../entities/user.entity';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('ET')
  phone: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  hireDate: Date;

  gender: Gender;

  @IsUUID()
  positionId: string;

  @IsUUID()
  photoId: string;
}
