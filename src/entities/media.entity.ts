import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Article } from './articles.entity';
import { User } from './user.entity';
import { MediaType } from 'src/enums/MediaType';


@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type!: MediaType;

  @Column()
  urlFichier!: string;

  @Column()
  titre!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ nullable: true })
  localisation!: string;

  @Column({ nullable: true })
  dateCapture!: Date;

  @ManyToOne(() => Article, (article) => article.medias, {
    onDelete: 'CASCADE',
  })
  article!: Article;

  @ManyToOne(() => User, (user) => user.medias)
  user!: User;
}