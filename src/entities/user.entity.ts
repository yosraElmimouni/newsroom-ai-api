import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Role } from './role.entity';
import { Article } from './articles.entity';
import { Notification } from './notification.entity';
import { Revision } from './revision.entity';
import { Media } from './media.entity';
import { IAAnalyse } from './ia_analyse.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  motDePasse!: string;

  @Column({ default: 'ACTIF' })
  statut!: string;

  @CreateDateColumn()
  dateCreation!: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @OneToMany(() => Revision, (revision) => revision.user)
  revisions!: Revision[];

  @OneToMany(() => Article, (article) => article.auteur)
  articles!: Article[];

  @OneToMany(() => Media, (media) => media.user)
  medias!: Media[];

  @OneToMany(() => IAAnalyse, (analyse) => analyse.user)
  analyses!: IAAnalyse[];
}