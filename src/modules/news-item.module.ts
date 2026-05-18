import { Module } from '@nestjs/common';
import { NewsItemService } from '../services/news-item.service';
import { NewsItemController } from '../controllers/news-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/articles.entity';
import { NewsItem } from 'src/entities/news-item.entity';
import { Source } from 'src/entities/source.entity';

@Module({
      imports: [TypeOrmModule.forFeature([NewsItem, Source, Article])],
  controllers: [NewsItemController],
  providers: [NewsItemService],
})
export class NewsItemModule {}
