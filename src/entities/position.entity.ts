import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';
import { UserEntity } from './user.entity';

@Entity('position')
export class PositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  parent_id: string;

  @ManyToOne(() => PositionEntity, (parent) => parent.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: PositionEntity;

  @OneToMany(() => PositionEntity, (child) => child.parent, { cascade: true })
  children: PositionEntity[];

  @OneToMany(() => UserEntity, (user) => user.position, { cascade: true })
  users: UserEntity[];
}
