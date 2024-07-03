// position.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('position')
export class PositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

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


