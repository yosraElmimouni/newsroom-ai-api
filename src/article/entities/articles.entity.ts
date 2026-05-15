import { Media } from 'src/media/entities/media.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';

export enum ArticleStatus {
  PUBLISH = 'Publier',
  DRAFT = 'Brouillon',
}

@Entity('articles')
export class Article {

  @PrimaryGeneratedColumn()
  id!: number;

//   @Column({
//     type: 'enum',
//     enum: ArticleStatus,
//     default: ArticleStatus.DRAFT
//   })
@Column({ nullable: true })
  status!: ArticleStatus;

  @Column({ nullable: true })
  categorie!: string;

//   @CreateDateColumn()
@Column({ nullable: true })
  date!: Date;

  @Column({ nullable: true })
  title!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ nullable: true })
  image!: string;

  @Column('simple-array', { nullable: true })
  tags!: string[];

  @OneToMany(() => Media, (media) => media.article, {
    cascade: true,
    eager: true
  })
  media!: Media[];
}