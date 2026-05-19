import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupService } from '../services/backup.service';
import { Source } from 'src/entities/source.entity';
import { Agenda } from 'src/entities/agenda.entity';
import { Media } from 'src/entities/media.entity';
import { Notification } from 'src/entities/notification.entity';
import { NewsItem } from 'src/entities/news-item.entity';
import { Revision } from 'src/entities/revision.entity';
import { User } from 'src/entities/user.entity';
import { Article } from 'src/entities/articles.entity';
import { IAAnalyse } from 'src/entities/ia_analyse.entity';
import { Role } from 'src/entities/role.entity';

export const ENTITIES = [
  Source,
  NewsItem,
  User,
  Agenda,
  Media,
  Notification,
  Revision,
  Article,
  IAAnalyse,
  Role
];

@Module({
  imports: [
    TypeOrmModule.forFeature(ENTITIES, 'default'),
    TypeOrmModule.forFeature(ENTITIES, 'backup')
  ],
  providers: [BackupService],
})
export class BackupModule {}