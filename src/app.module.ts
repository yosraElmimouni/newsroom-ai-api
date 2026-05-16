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
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject:[ConfigService],
        useFactory: (configservice: ConfigService)=> ({
          type:'postgres',
          host:configservice.get('DB_HOST'),
          port: parseInt(configservice.get('DB_PORT') || '5432'),
          username:configservice.get('DB_USERNAME'),
          password:configservice.get('DB_PASSWORD'),
          database:configservice.get('DB_NAME'),
          entities:[join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize:true
        })
      }
    ),
    ArticleModule,
    MediaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
