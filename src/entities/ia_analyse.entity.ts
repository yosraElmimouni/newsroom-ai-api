import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';

@Entity('ia_analyses')
export class IAAnalyse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  question!: string;

  @Column('text')
  resultat!: string;

  @Column()
  dateAnalyse!: Date;

  @ManyToOne(() => User, (user) => user.analyses)
  user!: User;
}