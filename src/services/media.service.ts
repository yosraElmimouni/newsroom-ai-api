import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from '../dto/create-media.dto';
import { UpdateMediaDto } from '../dto/update-media.dto';
import { Media } from 'src/entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly analyseRepository: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto) {
    const Media = this.analyseRepository.create(createMediaDto);

    return await this.analyseRepository.save(Media);
  }

  async findAll() {
    return await this.analyseRepository.find();
  }

  findOne(id: number) {
    return this.analyseRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const Media = await this.findOne(id);
    if (!Media) {
      throw new NotFoundException();
    }
    Object.assign(Media, updateMediaDto);

    return await this.analyseRepository.save(Media);
  }

  async remove(id: number) {
    const Media = await this.findOne(id);
    if (!Media) {
      throw new NotFoundException();
    }
    return await this.analyseRepository.remove(Media);
  }
}
