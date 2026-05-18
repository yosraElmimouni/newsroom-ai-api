import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { User } from './user.entity';
import { Article } from './articles.entity';

@Entity('revisions')
export class Revision {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dateRevision!: Date;

  @Column()
  commentaire!: string;

  @ManyToOne(() => User, (user) => user.revisions)
  user!: User;

  @ManyToOne(() => Article, (article) => article.revisions)
  article!: Article;
}