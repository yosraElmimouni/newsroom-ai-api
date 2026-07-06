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
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // ← déplacer ici
  AuthModule,  
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('DATABASE_URL');

        const config: any = {
          name: 'default',
          type: 'postgres',
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
        };

        if (url) {
          config.url = url;
          if (url.includes('neon.tech') || url.includes('render.com')) {
            config.ssl = { rejectUnauthorized: false };
          }
        } else {
          config.host = configService.get('DB_HOST') || 'localhost';
          config.port = parseInt(configService.get('DB_PORT') || '5432');
          config.username = configService.get('DB_USERNAME');
          config.password = configService.get('DB_PASSWORD');
          config.database = configService.get('DB_NAME');
        }
        return config;
      },
    }),
    TypeOrmModule.forRootAsync({
      name: 'backup',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const backupUrl = configService.get('BACKUP_DATABASE_URL');

        const config: any = {
          type: 'postgres',
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
        };

        if (backupUrl) {
          config.url = backupUrl;
          if (
            backupUrl.includes('neon.tech') ||
            backupUrl.includes('render.com')
          ) {
            config.ssl = { rejectUnauthorized: false };
          }
        } else {
          config.host = configService.get('DB_HOST') || 'localhost';
          config.port = parseInt(configService.get('DB_PORT') || '5432');
          config.username = configService.get('DB_USERNAME');
          config.password = configService.get('DB_PASSWORD');
          config.database = configService.get('DB_NAME') + '_backup';
        }
        return config;
      },
    }),
    UserModule,
    ScheduleModule.forRoot(),
    BackupModule,
    ArticleModule,
    MediaModule,
    AgendaModule,
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