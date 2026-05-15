import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';

import { Article } from 'src/article/entities/articles.entity';
@Entity('media')
export class Media {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  type!: string;

  @ManyToOne(() => Article, article => article.media)
  article!: Article;
}