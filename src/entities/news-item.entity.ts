import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

import { Source } from './source.entity';
import { Article } from './articles.entity';
import { CategorieNews } from 'src/enums/CategorieNews';

@Entity('news_items')
export class NewsItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column('text')
  contenu!: string;

  @Column()
  categorie!: CategorieNews;

  @Column()
  url!: string;

  @Column()
  datePublication!: Date;

  @ManyToOne(() => Source, (source) => source.newsItems)
  source!: Source;

  @ManyToMany(() => Article, (article) => article.newsItems)
  articles!: Article[];
}