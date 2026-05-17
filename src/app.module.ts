import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ArticleModule } from './article/article.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => ({

    type: 'postgres',

    host: configService.get('DB_HOST'),

    port: parseInt(
      configService.get('DB_PORT') || '5432'
    ),

    url: configService.get('DATABASE_URL'),

    username: configService.get('DB_USERNAME'),

    password: configService.get('DB_PASSWORD'),

    database: configService.get('DB_NAME'),

    ssl: {
      rejectUnauthorized: false,
    },

    entities: [
      join(__dirname, '**', '*.entity.{ts,js}')
    ],

    synchronize: true,
  }),
}),
    ArticleModule,
    MediaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
