import { Module } from '@nestjs/common';
import { MediaService } from '../services/media.service';
import { MediaController } from '../controllers/media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/articles.entity';
import { Media } from 'src/entities/media.entity';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Media, Article, User])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
