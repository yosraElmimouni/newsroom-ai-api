import { Module } from '@nestjs/common';
import { AgendaService } from '../services/agenda.service';
import { AgendaController } from '../controllers/agenda.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from 'src/entities/agenda.entity';
import { Source } from 'src/entities/source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agenda, Source])],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}
