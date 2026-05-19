import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ArticleModule } from './modules/article.module';
import { MediaModule } from './modules/media.module';
import { AgendaModule } from './modules/agenda.module';
import { UserModule } from './modules/user.module';
import { NewsItemModule } from './modules/news-item.module';
import { IaAnalyseModule } from './modules/ia_analyse.module';
import { NotificationModule } from './modules/notification.module';
import { RevisionModule } from './modules/revision.module';
import { RoleModule } from './modules/role.module';
import { SourceModule } from './modules/source.module';
import { BackupModule } from './modules/backup.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'postgres',

        host: configService.get('DB_HOST'),

        port: parseInt(configService.get('DB_PORT') || '5432'),

        url: configService.get('DATABASE_URL'),

        username: configService.get('DB_USERNAME'),

        password: configService.get('DB_PASSWORD'),

        database: configService.get('DB_NAME'),

        // ssl: {
        //   rejectUnauthorized: false,
        // },

        entities: [join(__dirname, '**', '*.entity.{ts,js}')],

        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'backup',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('BACKUP_DATABASE_URL'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true, 
      }),
    }),
    ScheduleModule.forRoot(),
    BackupModule, 
    ArticleModule,
    MediaModule,
    AgendaModule,
    UserModule,
    NewsItemModule,
    IaAnalyseModule,
    NotificationModule,
    RevisionModule,
    RoleModule,
    SourceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
