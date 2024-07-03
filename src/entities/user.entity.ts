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

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => PositionEntity, (position) => position.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => PhotoEntity, {
    cascade: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
    
  @JoinColumn({ name: 'photo_id' })
  photo: PhotoEntity;

 
}
