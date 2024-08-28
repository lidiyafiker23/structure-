import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import { PhotoEntity } from './photo.entity';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum Gender {
  Male = 'M',
  Female = 'F',
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  fullName: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsPhoneNumber('ET')
  @Column({ unique: true })
  phone: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Column('date')
  birthDate: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Column('date')
  hireDate: Date;

  @IsEnum(Gender)
  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @ManyToOne(() => PositionEntity, (position) => position.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @OneToOne(() => PhotoEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'photo_id' })
  photo: PhotoEntity;

  @IsUUID()
  @Column({ nullable: true })
  photoId: string;

  @IsUUID()
  @Column({ nullable: true })
  positionId: string;
}
