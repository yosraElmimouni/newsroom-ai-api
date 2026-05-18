import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRevisionDto } from '../dto/create-revision.dto';
import { UpdateRevisionDto } from '../dto/update-revision.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Revision } from 'src/entities/revision.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RevisionService {
  constructor(
    @InjectRepository(Revision)
    private readonly RevisionRepository: Repository<Revision>,
  ) {}

  async create(createRevisionDto: CreateRevisionDto) {
    const Revision = this.RevisionRepository.create(createRevisionDto);

    return await this.RevisionRepository.save(Revision);
  }

  async findAll() {
    return await this.RevisionRepository.find();
  }

  findOne(id: number) {
    return this.RevisionRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateRevisionDto: UpdateRevisionDto) {
    const Revision = await this.findOne(id);
    if (!Revision) {
      throw new NotFoundException();
    }
    Object.assign(Revision, updateRevisionDto);

    return await this.RevisionRepository.save(Revision);
  }

  async remove(id: number) {
    const Revision = await this.findOne(id);
    if (!Revision) {
      throw new NotFoundException();
    }
    return await this.RevisionRepository.remove(Revision);
  }
}
