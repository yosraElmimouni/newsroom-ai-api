import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { NewsItem } from './news-item.entity';
import { TypeSource } from 'src/enums/TypeSource';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column()
  url!: string;

  @Column()
  type!: TypeSource;

  @Column({ default: true })
  fiable!: boolean;

  @Column({ nullable: true })
  logoUrl!: string;

  @Column()
  pays!: string;

  @Column()
  langue!: string;

  @Column()
  dateCreation!: Date;

  @OneToMany(() => NewsItem, (news) => news.source)
  newsItems!: NewsItem[];
}