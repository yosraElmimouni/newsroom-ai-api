import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from './user.entity';
import { Media } from './media.entity';
import { Revision } from './revision.entity';
import { NewsItem } from './news-item.entity';
import { ArticleStatus } from 'src/enums/ArticleStatus';
import { CategorieArticle } from 'src/enums/CategorieArticle';



@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column('text')
  contenu!: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.Brouillon,
  })
  statut!: ArticleStatus;

  @Column({ nullable: true })
  categorie!: CategorieArticle;

  @CreateDateColumn()
  dateCreation!: Date;

  @UpdateDateColumn()
  dateModification!: Date;

  @Column({ nullable: true })
  datePublication!: Date;

  @Column('simple-array', { nullable: true })
  tags!: string[];

  // Auteur
  @ManyToOne(() => User, (user) => user.articles)
  auteur!: User;

  // Médias
  @OneToMany(() => Media, (media) => media.article, {
    cascade: true,
  })
  medias!: Media[];

  // Révisions
  @OneToMany(() => Revision, (revision) => revision.article)
  revisions!: Revision[];

  // News Items
  @ManyToMany(() => NewsItem, (news) => news.articles)
  @JoinTable({
    name: 'article_newsitem',
  })
  newsItems!: NewsItem[];
}