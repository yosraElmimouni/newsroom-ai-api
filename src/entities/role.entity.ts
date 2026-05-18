import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { User } from './user.entity';
import { Roles } from 'src/enums/Roles';


@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: Roles,
  })
  nomRole!: Roles;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}