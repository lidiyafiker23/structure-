import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('photo')
export class PhotoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('double precision', { default: 0 })
  views: number;

  @Column({ default: false })
  isPublished: boolean;


}
