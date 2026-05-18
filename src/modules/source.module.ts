import { Module } from '@nestjs/common';
import { SourceService } from '../services/source.service';
import { SourceController } from '../controllers/source.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsItem } from 'src/entities/news-item.entity';
import { Source } from 'src/entities/source.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Source, NewsItem])],

  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule {}
