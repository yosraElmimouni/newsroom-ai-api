import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { async } from 'rxjs';
import { CreateAgendaDto } from 'src/dto/create-agenda.dto';
import { UpdateAgendaDto } from 'src/dto/update-agenda.dto';
import { Agenda } from 'src/entities/agenda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private readonly agendaRepository: Repository<Agenda>,
  ) {}

  async create(createAgendaDto: CreateAgendaDto) {
    const Agenda = this.agendaRepository.create(createAgendaDto);

    return await this.agendaRepository.save(Agenda);
  }

  async findAll() {
    return await this.agendaRepository.find();
  }

  findOne(id: number) {
    return this.agendaRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateAgendaDto: UpdateAgendaDto) {
    const Agenda = await this.findOne(id);
    if (!Agenda) {
      throw new NotFoundException();
    }
    Object.assign(Agenda, updateAgendaDto);

    return await this.agendaRepository.save(Agenda);
  }

  async remove(id: number) {
    const Agenda = await this.findOne(id);
    if (!Agenda) {
      throw new NotFoundException();
    }
    return await this.agendaRepository.remove(Agenda);
  }
}
