import { Module } from '@nestjs/common';
import { IaAnalyseService } from '../services/ia_analyse.service';
import { IaAnalyseController } from './../controllers/ia_analyse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAAnalyse } from 'src/entities/ia_analyse.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IAAnalyse, User])],
  controllers: [IaAnalyseController],
  providers: [IaAnalyseService],
})
export class IaAnalyseModule {}
