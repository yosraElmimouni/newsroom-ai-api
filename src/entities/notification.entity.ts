import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  message!: string;

  @Column()
  type!: string;

  @Column({ default: false })
  lu!: boolean;

  @Column()
  dateEnvoi!: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  user!: User;
}