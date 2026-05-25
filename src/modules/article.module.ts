import { Module } from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { ArticleController } from './../controllers/article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Article } from './entities/article.entity';
import { Article } from '../entities/articles.entity';
import { Media } from 'src/entities/media.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Media, User])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
