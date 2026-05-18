import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIaAnalyseDto } from '../dto/create-ia_analyse.dto';
import { UpdateIaAnalyseDto } from '../dto/update-ia_analyse.dto';
import { IAAnalyse } from '../entities/ia_analyse.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class IaAnalyseService {
  constructor(
    @InjectRepository(IAAnalyse)
    private readonly analyseRepository: Repository<IAAnalyse>,
  ) {}

  async create(createIAAnalyseDto: CreateIaAnalyseDto) {
    const IAAnalyse = this.analyseRepository.create(createIAAnalyseDto);

    return await this.analyseRepository.save(IAAnalyse);
  }

  async findAll() {
    return await this.analyseRepository.find();
  }

  findOne(id: number) {
    return this.analyseRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateIAAnalyseDto: UpdateIaAnalyseDto) {
    const IAAnalyse = await this.findOne(id);
    if (!IAAnalyse) {
      throw new NotFoundException();
    }
    Object.assign(IAAnalyse, updateIAAnalyseDto);

    return await this.analyseRepository.save(IAAnalyse);
  }

  async remove(id: number) {
    const IAAnalyse = await this.findOne(id);
    if (!IAAnalyse) {
      throw new NotFoundException();
    }
    return await this.analyseRepository.remove(IAAnalyse);
  }
}
