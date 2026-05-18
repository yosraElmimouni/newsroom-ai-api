import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSourceDto } from '../dto/create-source.dto';
import { UpdateSourceDto } from '../dto/update-source.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from 'src/entities/source.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source)
    private readonly SourceRepository: Repository<Source>,
  ) {}

  async create(createSourceDto: CreateSourceDto) {
    const Source = this.SourceRepository.create(createSourceDto);

    return await this.SourceRepository.save(Source);
  }

  async findAll() {
    return await this.SourceRepository.find();
  }

  findOne(id: number) {
    return this.SourceRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateSourceDto: UpdateSourceDto) {
    const Source = await this.findOne(id);
    if (!Source) {
      throw new NotFoundException();
    }
    Object.assign(Source, updateSourceDto);

    return await this.SourceRepository.save(Source);
  }

  async remove(id: number) {
    const Source = await this.findOne(id);
    if (!Source) {
      throw new NotFoundException();
    }
    return await this.SourceRepository.remove(Source);
  }
}
